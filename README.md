# Route Builder - komoot challenge

[TODO]

## Overview

[TODO]

## Process

### Requirements

"Develop a react app that enables you to plan your cross country run and download it as GPX file."

- [x] `Runners` should be able to place `Waypoints` anywhere on the `Map`
- [x] `Waypoints` should also be added to added as list items to the `WaypointList`
- [ ] `Waypoints` should be able to be moved arround on the `Map`
- [ ] `Waypoints` should be able to be named and re-named
- [x] `Waypoints` should be able to be removed
- [x] `Waypoints` should be able to be re-ordered
- [ ] `Waypoints` should be connected to form a `Route`

### UI Components

[TODO]

### Data Model

Types:

```typescript
interface Waypoint {
  id: string;
  name: string;
  index: number;
  coordinates: [number, number];
}

interface Route {
  waypoints: Waypoint[];
}
```

### Bootstrapping

I bootsraped this project using [Create React App](https://github.com/facebook/create-react-app) which I find to be usefull for quickly spinning up front-end projects when prototyping, but also for longer term projects as it has great developer support and is quite configurable through add-ons like [CRACO](https://github.com/gsoft-inc/craco) (I have not needed to eject in a long time). For more details on Create React App, see the [Development](#development) section below.

### Testing

_[TODO]_

### Deployment

_[TODO]_

---

## Development

_The following is copied over from the CRA default README:_

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
