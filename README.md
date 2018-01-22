# Log Parser #
## BT Coding Evaluation Submission

This submission is written for Node 6.11, code is written according the eslint standard with plugins for the test environment.

## Get Started
* Change to node version 6.11
  * install [nvm](https://github.com/creationix/nvm#install-script) if you don't have it
  * `nvm use`
  * `nvm deactivate` to return to system node version

* Get dependencies (test frameworks, coverage, documentation)
  * `npm install`

* Show tests
  * `npm test`
* Show coverage
  * `npm run coverage`
* Show docs
  * `npm run docs`

* Run parser against file
  * `node app.js test/resources/exampleInput.txt`

Example input file
```
1508405807242 1508405807141 vader HELLO
1508405807340 1508405807350 luke HELLO
1508405807378 1508405807387 luke LOST vader
1508405807467 1508405807479 luke FOUND r2d2
1508405807468 1508405807480 luke LOST leia
1508405807512 1508405807400 vader LOST luke
1508405807560 1508405807504 vader HELLO
```

Example Output
```
vader ALIVE 1508405807560 vader HELLO
luke ALIVE 1508405807468 luke LOST leia
r2d2 ALIVE 1508405807467 luke FOUND r2d2
leia DEAD 1508405807468 luke LOST leia
```
