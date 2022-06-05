#!/bin/bash

set -e

src/misc/licensed-download.sh

echo 'Running: licensed cached'
_temp/licensed-3.7.2/licensed cache