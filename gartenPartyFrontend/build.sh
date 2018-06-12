rm -rf node_modules && npm install

# Currently (temporarily!?) required for sass
npm rebuild node-sass
npm update
# end
ng build --prod