class NavigationHistory {
  constructor( rootId ) {
    this.history = [rootId];
    this.address = ["/"]
    this.cursor = 0;
  }

  append( folderId, folderPath ) {
    this.history = this.history.slice(0, this.cursor + 1);
    this.history.push(folderId);

    this.address = this.address.slice(0, this.cursor + 1);
    this.address.push(folderPath);

    this.cursor += 1;
  }

  nav_back() {
    if (this.cursor) {
      this.cursor -= 1;
    }
  }

  nav_forward() {
    if ( this.cursor < this.history.length - 1 ) {
      this.cursor +=1;
    }
  }

  current() {
    return this.history[this.cursor];
  }

  currentPath() {
    return this.address[this.cursor];
  }
}

// Initialise the navigation history
var navHistory = new NavigationHistory('rootFolder');

// Set id separator
const idSeparator = '---';


document.addEventListener('DOMContentLoaded', () => {

  // Limit DOM to file-browser (just in case)
  const $fileBrowser = document.querySelector('.file-browser');

  // Get all navigation buttons
  const $navBack = $fileBrowser.querySelector('#file-nav-back');
  const $navForward = $fileBrowser.querySelector('#file-nav-forward');
  const $navUp = $fileBrowser.querySelector('#file-nav-up');

  // Get the sorting button
  const $sortButton = $fileBrowser.querySelector('.sorting .button');
  const $sortIcons = $fileBrowser.querySelectorAll('.sorting .button .button-icon');

  // Get all "view buttons" elements
  const $viewButtons = Array.prototype.slice.call($fileBrowser.querySelectorAll('.view .button'), 0);

  // Get the address bar
  const $addressBar = $fileBrowser.querySelector('#file-address-bar');

  // Get all "browser" elements
  const $browserViews = Array.prototype.slice.call($fileBrowser.querySelectorAll('.browser'), 0);

  // Add click events to any view buttons
  if ( $viewButtons.length > 0 ) {

    // Add a click event on each of them
    $viewButtons.forEach( el => {
      el.addEventListener('click', () => {
        // Switch the mode
        if ( el.id === "list-view" ) {
          $fileBrowser.classList.add("list-view");
        } else {
          $fileBrowser.classList.remove("list-view");
        }
      });
    });
  }

  // Add click events to folders in each browser
  $browserViews.forEach( browser => {

    // Get a list of the folders in the browser
    $browserFolders = Array.prototype.slice.call(browser.querySelectorAll('.folder'), 0);

    // If there are folders, add click events to them
    if ( $browserFolders.length > 0 ) {
      $browserFolders.forEach ( folder => {
        folder.addEventListener('click', () => {
          // Mark the current browser as inactive
          $fileBrowser.querySelector(String('#' + browser.id).split('.').join('\\.')).classList.remove('is-active');

          // Mark the folder target as active
          let browserId = browser.id + idSeparator + folder.dataset.folderId;
          $fileBrowser.querySelector(String('#' + browserId).split('.').join('\\.')).classList.add('is-active');

          // Get the folder name and path
          let folderName = folder.querySelector('.filename').innerText;
          let folderPath = navHistory.currentPath() + folderName + "/";

          // Set the address bar content
          $addressBar.innerText = folderPath;
          console.log(folderName);

          // Add to the nav history
          navHistory.append(browserId, folderPath);

          // Set the activity of the nav buttons
          $navBack.classList.add('is-active');
          $navForward.classList.remove('is-active');
          $navUp.classList.add('is-active');
        });
      });
    }
  });

  // Add event listeners for navigation
  $navBack.addEventListener('click', () => {
    // If we're at the limit, just return
    if ( navHistory.cursor === 0 ) {
      return
    }

    // Deactivate the current view, navigate back, then activate the previous view
    $fileBrowser.querySelector(String('#' + navHistory.current()).split('.').join('\\.')).classList.remove('is-active');
    navHistory.nav_back();
    $fileBrowser.querySelector(String('#' + navHistory.current()).split('.').join('\\.')).classList.add('is-active');

    // Enable the forward nav button
    $navForward.classList.add('is-active');

    // Set the address bar to the new path
    $addressBar.innerText = navHistory.currentPath();

    // If the cursor has reached start, deactivate the button
    if ( navHistory.cursor === 0 ) {
      $navBack.classList.remove('is-active');
    }

    // Update the 'up' nav button status
    if ( navHistory.current() === "rootFolder" ){
      $navUp.classList.remove('is-active');
    } else {
      $navUp.classList.add('is-active');
    }
  });

  $navForward.addEventListener('click', () => {
    // If we're at the limit, just return
    if ( navHistory.cursor === navHistory.history.length - 1 ) {
      return
    }

    // Deactivate the current view, navigate forward, then activate the next view
    $fileBrowser.querySelector(String('#' + navHistory.current()).split('.').join('\\.')).classList.remove('is-active');
    navHistory.nav_forward();
    $fileBrowser.querySelector(String('#' + navHistory.current()).split('.').join('\\.')).classList.add('is-active');

    // Enable the backward nav button
    $navBack.classList.add('is-active');

    // Set the address bar to the new path
    $addressBar.innerText = navHistory.currentPath();

    // If the cursor has reached end, deactivate the button
    if ( navHistory.cursor === navHistory.history.length - 1 ) {
      $navForward.classList.remove('is-active');
    }

    // Update the 'up' nav button status
    if ( navHistory.current() === "rootFolder" ){
      $navUp.classList.remove('is-active');
    } else {
      $navUp.classList.add('is-active');
    }
  });

  $navUp.addEventListener('click', () => {
    // Get the current path and determine the parent
    let path = navHistory.current().split(idSeparator);
    let parentId = path.slice(0, -1).join(idSeparator);

    // If the parentId is non-empty, switch the active statii
    if ( parentId ) {
      $fileBrowser.querySelector(String('#' + navHistory.current()).split('.').join('\\.')).classList.remove('is-active');
      $fileBrowser.querySelector(String('#' + parentId).split('.').join('\\.')).classList.add('is-active');

      // Get the parent path
      // Slice two off to remove trailing '/'
      let parentPath = navHistory.currentPath().split('/').slice(0, -2).join('/') + '/';

      navHistory.append(parentId, parentPath);
      $addressBar.innerHTML = parentPath;
    }

    // Disable the button if we are at the root folder
    if ( parentId === "rootFolder" ) {
      $navUp.classList.remove('is-active');
    }
  });


  // Add listener to the sorting button
  if ( $sortButton !== null ) {
    $sortButton.addEventListener('click', () => {
      // Toggle the activity of icons
      $sortIcons.forEach( icon => {
        icon.classList.toggle("is-active");
      });

      // Reorder everything...
      $browserViews.forEach( browser => {
        // Get the files and folders
        $folders = browser.querySelectorAll('.folder-item');
        $files = browser.querySelectorAll('.file-item');

        // Rewrite the content with the sorted
        browser.append(...Array.from($files).reverse());
        browser.prepend(...Array.from($folders).reverse());
      });
    });
  }
});
