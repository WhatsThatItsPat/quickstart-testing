# Unit Test Cloud Functions

This sample demonstrates how to write **unit tests** for Cloud Functions using
the `firebase-functions-test` SDK and the Emulator Suite.

## Setup

To install the dependencies for this sample run `npm install` inside the `functions` directory.
You will also need the [Firebase CLI](https://firebase.google.com/docs/cli).

## Run

To run the tests:

```
firebase emulators:exec --project=fakeproject 'npm run test'

# Or use demo prefix...

firebase emulators:exec --project=demo-fake-project 'npm run test'

# This will be in the output: 'Detected demo project ID "demo-fake-project",
#   emulated services will use a demo configuration and attempts to access
#   non-emulated services for this project will fail.'
```
