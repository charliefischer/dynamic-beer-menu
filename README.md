# Keep the Pubs busy
A tool designed to create a dynamic menu that will adjust the price of beer to keep pubs busy throughout the week
<br />
### Requirements:
- The more beer in the keg, the cheaper it should be. Supply and demand 101
- Friday and Saturday are already busy, hike up the price to make people go during the week instead
- The busier the pub, the more pricey the beers should be. By reducing the number of people inside will let the bar staff have a breather


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## To Do:
- [ ] the time of day should affect the beer. A pint at 2pm? Should be giving those away.
- [ ] the functions should directly impact the data in Firebase not just change local variables. Refresh the page you're back at square one
- [ ] the functionality should extend beyond lager. Other than a hot summers day I'm going to swerve that one.