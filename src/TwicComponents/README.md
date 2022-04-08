# How to use this as a library in other projects

1. We have a flag named **main** in package.json file which says to get files from **lib/index.ts**. When we publish it on github this library and re-install it in our projects it will take files from **lib/index.ts**.

# How to make changes and publish the change on github

1. Create a new branch from **dev_components**.
2. Create components on this new branch.
3. Once done, merge this branch with development having **ios, android, index.js, App.tsx** files and folders.
4. Checkout to **dev_components** if you are on development.
5. Update **version** in package.json file and then create build by running **npm run build**. Once done, create a PR for it with **master**.
6. Make sure git repo does not have **ios, android, index.js, App.tsx** files and folders.
7. Once merged, push changes to remote.
8. Move to affected repos and run **npm i twic_mobile_components**.

# Run app as a playground for your components

1. **App.tsx** will act as a play ground. Create components in **components** folder. Import components in **App.tsx** file. Once you are done with your work, clean the code within **<SafeAreaView>**
2. **npm run start** and **npm run ios** will run the playground.
