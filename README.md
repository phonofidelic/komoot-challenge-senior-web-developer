# Route Builder - komoot challenge

This is my solution for komoot's senior web developer challenge. The assignment is to create a route mapping application for cross-country runners that allows users to plan and download their route as a GPX file. The application is also to be built without the help of 3rd party React components such as react-leaflet or react-dnd.

## Overview

A live demo for this project can be seen [here](https://komoot-challenge-phonofidelic.netlify.app/). The app initially asks the user for location permissions to center the map. The user can then double-click a point on the map to add a Waypoint. The Waypoints are added to a sortable list and are joines on the map to form a route. The route can be downloaded as a GPX file and uploaded to another mapping tool such as [gpx.studio](https://gpx.studio/).
![Image of the resulting user interface](doc_assets/1_result.png)

## Process

### Requirements

The requirements for the assignment were summed up as:

"Develop a react app that enables you to plan your cross country run and download it as GPX file.

Cross Country runners are not bound to the streets. Your users can plan their favorite route across fields and hills by just placing markers as waypoints on the map. For detailed planning the same waypoints show up as a list where users can delete and rearrange them until the route is perfect and ready to download. The user interface should be close to the design to the left."

- [x] `Runners` should be able to place `Waypoints` anywhere on the `Map`
- [x] `Waypoints` should also be added as list items to the `WaypointList`
- [x] `Waypoints` should be able to be moved around on the `Map`
- [ ] `Waypoints` should be able to be named and re-named
- [x] `Waypoints` should be able to be removed
- [x] `Waypoints` should be able to be re-ordered
- [x] `Waypoints` should be connected to form a `Route`
- [x] The `Route` should be downloadable as a GPX file

### Wireframe

I started out by creating [a basic wireframe in Figma](https://www.figma.com/file/7jmBDH5miljxU8xOZpW95f/Untitled?node-id=0%3A1) in order to help clarify the requirements and discern some of the basic UI components that would be needed:
![Wireframe created in Figma](doc_assets/2_wireframe.png)

### UI Components

The [Material UI](https://mui.com/) component library was used as the base for list items, grid layout and icons. Styling was achieved using a combination of [styled-components](https://styled-components.com/) and inline CSS in JSX.

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

I bootstrapped this project using [Create React App](https://github.com/facebook/create-react-app) which I find to be useful for quickly spinning up front-end projects when prototyping, but also for longer term projects as it has great developer support and is quite configurable through add-ons like [CRACO](https://github.com/gsoft-inc/craco) (I have not needed to eject in a long time). For more details on Create React App, see the [Development](#development) section below.

### Testing

_TODO: unit tests to be set up using [Jest](https://jestjs.io/) and [Testing Library](https://testing-library.com/)_

### Deployment

The web app is deployed to [Netlify](https://www.netlify.com/) on succesfull merges to `main`. A live demo of the app can be seen [here](https://komoot-challenge-phonofidelic.netlify.app/).

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
