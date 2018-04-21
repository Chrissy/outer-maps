![](https://s3-us-west-2.amazonaws.com/chrissy-portfolio-images/gunk_2.png)

# Trail Gunk
Beautiful outdoor maps for backpackers &amp; trailrunners; built on National Park Service data.

# Installation (OSX)

* Install Homebrew, XCode & Developer Tools 
* `brew install node npm postgres postgis`
* `createdb mountains`
* `psql -d mountains -c 'create extension postgis'` 
* `npm install -g gulp db-migrate`
* `npm install`
* `npm run migrate` (currently, you will need access to the dropbox lib directory for this step to work!)
* `gulp mapify` (this generates the tile styles, gulp will watch for further changes once you start the dev server)
* `npm run trails` (generate the local trails tiles)
* `npm run dev`
