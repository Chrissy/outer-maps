![](https://s3-us-west-2.amazonaws.com/chrissy-portfolio-images/gunk_2.png)

# Trail Gunk
Beautiful outdoor maps for backpackers &amp; trailrunners; built on National Park Service data.

# Installation (OSX)

1. Install Homebrew, XCode & Developer Tools 
2. `brew install node npm postgres postgis`
3. `createdb mountains`
4. `psql -d mountains -c 'create extension postgis'` 
5. npm install
6. `npm run migrate` (currently, you will need access to the dropbox lib directory for this step to work!)
7. `npm run dev`
