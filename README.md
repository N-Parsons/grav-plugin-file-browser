# Grav File Browser Plugin

The **File Browser plugin** for [Grav](http://github.com/getgrav/grav) is a highly-configurable solution for providing visitors with a file browser/directory listing.

![](assets/views-slim.png)

## Installation

The preferred method of installation is via the GPM, which makes it easy to keep the plugin up-to-date.

```
$ bin/gpm install file-browser
```

### Manual installation

Alternatively, you can download the zip version of this repository, unzip to `/your/site/grav/user/plugins` and rename directory to `file-browser`.

## Configuration

By default, the plugin is configured to source files from `user://files`, which doesn't usually exist and will need to be created. Typically this will resolve to `user/files`, but if you're using a multi-site setup, it will resolve to `user/sites/{site-name}/files`.

### Options

- `enabled`: (bool) Plugin status.
- `built_in_css`: (bool) Whether to load the built-in CSS.
- `load_font_awesome`: (bool) Whether to load Font Awesome Free.
- `source`: (text) URI for file directory (eg. `user://files`).
- `show_hidden_files`: (bool) Whether to show hidden files.
- `default_view`: (`tile`/`list`) Default view for the file browser.
- `base_to_extend`: (text) Twig template to extend (eg. `partials/base.html.twig`).

#### Font Awesome Pro

- `use_alt_arrows`: (bool) Whether to use `fa-arrow-alt-*` for navigation controls.
- `icon_weight`: (`fas`/`far`/`fal`) Font Awesome variant to use.

#### File icons

- `file_icon_default`: (text) Default icon to use for files.
- `show_thumbnails`: (bool) Whether to generate thumbnails.
- `thumbnail_types`: (text, comma separated) File types to generate thumbnails for.
- `file_specific_icons`: Whether to use specific icons for defined file types.
- `colourise_icons`: (bool) Whether to colourise specific icon types.
- `file_icon_types`: (list) Font Awesome icon: comma-separated list of extensions (eg. `fa-file-video: 'mp4, mov'`).


### Per-page configuration

All configuration options can be overridden on a per-page basis simply by adding the same keys to the template page under a key called `file_browser:`. For example:

```yaml
title: Raw Pages
file_browser:
  source: "user://pages"
```


## To Do

- [ ] Build an admin panel for managing files.
- [ ] Make file-specific icon colouring configurable via the config file.
- [ ] Include template for modular pages.
- [ ] Implement shortcode insertion.
- [ ] Add support for sourcing files from outside of Grav.
- [ ] Translations: Please send me pull requests!

## License

MIT license. See [LICENSE](LICENSE)
