![](https://imgur.com/a/lDBlump.jpg)

# Outer Maps
Free interactive outdoor maps for backpackers &amp; trailrunners; built on National Park Service data.

# Installation (OSX)

* Install Homebrew, XCode & Developer Tools
* `brew install node npm postgres postgis tippecanoe`
* `createdb mountains`
* `psql -d mountains -c 'create extension postgis'`
* `npm install -g gulp db-migrate`
* `npm install`
* `npm run migrate` (this is gonna take a while)
* `npm run trails` (generate the local trails tiles)
* `gulp mapify` (this generates the tile styles, gulp will watch for further changes once you start the dev server)
* `npm run dev`
