{exec} = require 'child_process'

# ANSI Terminal Colors
bold = '\x1b[0;1m'
green = '\x1b[0;32m'
reset = '\x1b[0m'
red = '\x1b[0;31m'

log = (message, color, explanation) -> console.log color + message + reset + ' ' + (explanation or '')

task 'build', 'Compile source', -> build()
task 'watch', 'Compile and watch source', -> build yes


build = (watch) ->
  exec "coffee -c #{if watch then "-w" else ""} index", (err, stdout, stderr) ->
    throw err if err
    log ":)", green
