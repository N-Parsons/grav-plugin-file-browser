<?php
namespace Grav\Plugin;

use \Grav\Common\Plugin;
use \RocketTheme\Toolbox\Event\Event;

class FileBrowserPlugin extends Plugin
{
  public static function getSubscribedEvents()
  {
    return [
      'onGetPageTemplates' => ['onGetPageTemplates', 0],
      'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
      'onPageInitialized' => ['getFolderStructure', 0]
    ];
  }

  /**
   * Add the templates to the list in the Admin plugin
   */
  public function onGetPageTemplates(Event $event)
  {
    //$event->types->scanBlueprints(__DIR__.'/blueprints');
    $event->types->scanTemplates(__DIR__."/templates");
  }

  /**
   * Add the templates to twig lookup paths (for rendering)
   */
  public function onTwigTemplatePaths()
  {
    $this->grav['twig']->twig_paths[] = __DIR__ . '/templates';
  }

  /**
   * Discover the folder structure if the page template is "file-browser"
   */
  public function getFolderStructure(Event $event)
  {
    $page = $event['page'];

    // Exit and do nothing if it's not a file-browser page
    if ($page->template() !== "file_browser_plugin") {
      return;
    }

    // Get relevant configs
    $pluginConfig = $this->grav['config']->get('plugins')["file-browser"];
    $pageConfig = isset($page->header()->file_browser) ? $page->header()->file_browser : array("enabled"=>true);

    // Combine them, preferring the page config
    $config = array_merge($pluginConfig, $pageConfig);

    // Load the header configuration with default
    $filesDir = isset($config["source"]) ? $config["source"] : "user://files";

    // Get the path using the resource locator (relative to the root directory)
    $path = $this->grav['locator']->findResource($filesDir, $absolute = false);

    // Get filters
    $showHidden = isset($config["show_hidden_files"]) ? $config["show_hidden_files"] : false;

    $filters = array("show_hidden"=>$showHidden);

    // If the path doesn't exist, send an error
    // We catch this error in the Twig template by testing iterability:
    // If this routine is successful, the 'filebrowser' variable will be an array, but here we set a string.
    if (!$path) {
      $this->grav["twig"]->twig_vars["fileBrowserContent"] = "Path not found: ".$filesDir;
    } else {
      $this->grav["twig"]->twig_vars["fileBrowserContent"] = getFolderStructure($path, $filters);
    }
  }
}


/**
 * getFolderStructure returns an array describing the structure
 *
 * Files are stored as an array: ["file name", "file location"]
 * Folders are stored as an array: ["folder name", [folder contents]]
 */
function getFolderStructure($path, $filters) {
  $structure = array();

  $folderContents = scanFolder($path, $filters);
  $folderList = $folderContents[0];
  $fileList = $folderContents[1];

  foreach ($folderList as $folder) {
    array_push($structure, [$folder[0], getFolderStructure($folder[1], $filters)]);
  }

  foreach ($fileList as $file) {
    array_push($structure, $file);
  }

  return $structure;
}


function scanFolder($path, $filters) {
  $contents = scandir($path);
  $fileList = array();
  $folderList = array();

  $showHidden = isset($filters["show_hidden"]) ? $filters["show_hidden"] : false;

  foreach ($contents as $item) {
    if ($item === "." or $item === "..") {
      continue;
    }

    if ( (substr($item, 0, 1) === ".") && !($showHidden) ) {
      continue;
    }

    $itemPath = $path . "/" . $item;

    if (is_dir($itemPath)) {
      array_push($folderList, [$item, $itemPath]);

    } else {
      array_push($fileList, [$item, $itemPath]);
    }
  }

  return [$folderList, $fileList];
}
