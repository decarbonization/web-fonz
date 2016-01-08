# Fonz

[![Circle CI](https://circleci.com/gh/decarbonization/web-fonz.svg?style=svg&circle-token=400cd73004d30e2019aeaedf86e8a8bc0e0a0ba6)](https://circleci.com/gh/decarbonization/web-fonz)

A clone of the iconfactory's excellent [Frenzic](http://frenzic.com/) game.

# Building

## Prerequisites

- Ruby ([Installer for Windows](http://rubyinstaller.org/))
- Node.js and npm ([Installer](https://nodejs.org/en/download/))
- Bundler ([Install directions](http://bundler.io/))

## Building

Before building the project, you will need to install the external dependencies. The build script will do this for you:

```sh
# Unix-like systems
cd web-fonz
{sudo} ./build dependencies
```

```bat
REM Windows
cd web-fonz
build dependencies
```

After the dependencies are installed, all you need to do is run the build command:

```sh
# Unix-like systems
cd web-fonz
{sudo} ./build project
```

```bat
REM Windows
cd web-fonz
build project
```

Once the project is built, you can either open `index.html` in your preferred web browser, or run `build serve`.

# License

    Copyright (c) 2015, Peter 'Kevin' MacWhinnie
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    1. Redistributions may not be sold, nor may they be used in a commercial
       product or activity.
    2. Redistributions of source code must retain the above copyright notice, this
       list of conditions and the following disclaimer.
    3. Redistributions in binary form must reproduce the above copyright notice,
       this list of conditions and the following disclaimer in the documentation
       and/or other materials provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
    ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

(Derived from new the BSD License combined with the non-commercial clause from the MAME license.)
