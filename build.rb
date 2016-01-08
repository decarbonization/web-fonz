# Copyright (c) 2015, Peter 'Kevin' MacWhinnie
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# 1. Redistributions may not be sold, nor may they be used in a commercial
#    product or activity.
# 2. Redistributions of source code must retain the above copyright notice, this
#    list of conditions and the following disclaimer.
# 3. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
# ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

require 'colorize'
require 'fileutils'
require 'webrick'
require 'socket'

TS_PROJECTS = ['src/main', 'src/test']
SASS_PROJECTS = ['style']
CLEAN_DIRS = ['js', '.sass-cache', 'dist']
CLEAN_GLOBS = ['style/*.css.map', 'style/*.css']

PACKAGE_DEST = 'dist/'
PACKAGE_EXCLUDE = ['style/board.css', 'style/images.css', 'style/dimensions.css', 'js/test.js']

XUNIT_OUTPUT_FILE = '_TestResults.xml'

COMMANDS = {}
COMMAND_DESCRIPTIONS = {}
EXECUTED_COMMANDS = []

Dir::chdir(File::dirname($0))

def begin_command(name)
  puts "- #{name}".blue.bold
end

def begin_task(info)
  puts "| #{info}".yellow.bold
end

def print_usage
  puts "Usage: build command..."
  puts
  puts "Commands:"
  COMMANDS.each_pair do |cmd, _|
    info = COMMAND_DESCRIPTIONS[cmd]
    puts " #{cmd.bold} -- #{info}"
  end
end

def handle_cmd_out(output)
  status = $?.exitstatus
  if status == 0
    $stdout.puts(output.green) unless output.empty?
  else
    $stderr.puts(output.red) unless output.empty?
    exit(status)
  end
end

def normalize_name(name)
  name.downcase
end

def run_command(name, args)
  normalized_name = normalize_name(name)
  return if EXECUTED_COMMANDS.include? normalized_name
  
  command = COMMANDS[normalized_name]
  if command.nil?
    puts "Unknown command #{normalized_name}".red.bold
    print_usage
    exit(-1)
  end
  
  begin
    command[args]
  rescue => e
    $stderr.puts(e.to_s.red)
    exit(-1)
  end
  
  EXECUTED_COMMANDS << normalized_name
end

def prerequisite(name, args = [])
  normalized_name = normalize_name(name)
  run_command(normalized_name, args) unless EXECUTED_COMMANDS.include? normalized_name
end

COMMAND_DESCRIPTIONS['dependencies'] = "Sets up external project dependencies"
COMMANDS['dependencies'] = lambda do |args|
  begin_command "Dependencies"
  
  begin_task "Ruby dependencies"
  handle_cmd_out(%x[bundler install])
  
  begin_task "Node.js dependencies"
  handle_cmd_out(%x[npm install])
end

COMMAND_DESCRIPTIONS['project'] = "Compiles all of the project source files"
COMMANDS['project'] = lambda do |args|
  begin_command "Build Project"
  
  TS_PROJECTS.each do |project|
    begin_task "'#{project}'"
    handle_cmd_out(%x[node node_modules/typescript/bin/tsc -p "#{project}"])
  end
  
  SASS_PROJECTS.each do |project|
    begin_task "'#{project}'"
    Dir["#{project}/*.scss"].each do |file|
      file_without_ext = file.chomp(File::extname(file))
      handle_cmd_out(%x[sass --no-cache --update "#{file}:#{file_without_ext}.css"])
    end
  end
end

COMMAND_DESCRIPTIONS['test'] = "Runs all project unit tests"
COMMANDS['test'] = lambda do |args|
  prerequisite('project')
  
  begin_command "Test"
  begin_task "All tests"
  if args.include? "-x"
    File::delete(XUNIT_OUTPUT_FILE) if File::exist? XUNIT_OUTPUT_FILE
    
    output = %x[node node_modules/mocha-phantomjs/bin/mocha-phantomjs --reporter xunit test.html]
    handle_cmd_out(output)
    
    File::open(XUNIT_OUTPUT_FILE, 'w') do |f|
      f.write(output)
    end
  else
    system("node node_modules/mocha-phantomjs/bin/mocha-phantomjs test.html")

    status = $?.exitstatus
    exit(status) if status != 0
  end
end

COMMAND_DESCRIPTIONS['package'] = "Packages the project for distribution"
COMMANDS['package'] = lambda do |args|
  prerequisite 'project'
  prerequisite 'test'
  
  begin_command "Package"
  
  unless Dir::exist? PACKAGE_DEST
    begin_task "Creating '#{PACKAGE_DEST}'"
    Dir::mkdir(PACKAGE_DEST)
  end
  
  begin_task "Copying js"
  js_dest = File::join(PACKAGE_DEST, "js")
  FileUtils::rm_r(js_dest) if Dir::exist? js_dest
  Dir::mkdir(js_dest)
  
  Dir["js/*.js"].each do |file|
    next if PACKAGE_EXCLUDE.include? file
    
    file_dest = File::join(js_dest, File::basename(file))
    begin_task "Copying '#{file}' to '#{file_dest}"
    FileUtils::cp(file, file_dest)
  end
  
  begin_task "Copying css"
  style_dest = File::join(PACKAGE_DEST, "style")
  FileUtils::rm_r(style_dest) if Dir::exist? style_dest
  Dir::mkdir(style_dest)
  
  Dir["style/*.css"].each do |file|
    next if PACKAGE_EXCLUDE.include? file
    
    file_dest = File::join(style_dest, File::basename(file))
    begin_task "Copying '#{file}' to '#{file_dest}"
    FileUtils::cp(file, file_dest)
  end
  
  begin_task "Copying images"
  FileUtils::cp_r("style/img", File::join(style_dest, "img"))
  
  begin_task "Copying 'index.html'"
  FileUtils::cp("index.html", File::join(PACKAGE_DEST, "index.html"))
end

COMMAND_DESCRIPTIONS['clean'] = "Deletes all compiled project files"
COMMANDS['clean'] = lambda do |args|
  begin_command "Clean"
  
  CLEAN_DIRS.each do |dir|
    begin_task "'#{dir}'"
    next unless Dir::exist? dir
    FileUtils::rm_r(dir)
  end
  
  CLEAN_GLOBS.each do |glob|
    Dir[glob].each do |file|
      begin_task "'#{file}'"
      next unless File::exist? file
      File::delete(file)
    end
  end
  
  File::delete(XUNIT_OUTPUT_FILE) if File::exist? XUNIT_OUTPUT_FILE
end

COMMAND_DESCRIPTIONS['serve'] = "Run a local server for the project"
COMMANDS['serve'] = lambda do |args|
  begin_command "Serving Project"
  begin_task "Host addresses:"
  Socket::ip_address_list.each do |address|
    puts address.ip_address.green
  end
  
  begin_task "Starting Server"
  server = WEBrick::HTTPServer.new :Port => 9090, :DocumentRoot => Dir::pwd
  trap('INT') { server.shutdown }
  server.start
end

if ARGV.empty?
  print_usage
  exit
end

args_marker = ARGV.index('--')
if args_marker.nil?
  commands = ARGV
  args = []
else
  commands = ARGV[0, args_marker]
  args = ARGV[args_marker + 1, ARGV.length]
end

commands.each do |command|
  run_command(command, args)
end
