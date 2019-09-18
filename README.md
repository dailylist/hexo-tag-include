# hexo-tag-include
[![Downloads](https://img.shields.io/npm/dm/hexo-tag-include.svg)](https://www.npmjs.com/package/hexo-tag-include) [![npm](https://img.shields.io/npm/v/hexo-tag-include.svg)](https://www.npmjs.com/package/hexo-tag-include) [![LICENSE](https://img.shields.io/npm/l/hexo-tag-include.svg)](LICENSE)

Include another post or page to a post or page as wiki does.

## Installation
```
npm install hexo-tag-include
```

## Syntax

### Include a post
```
{% include_post slug '{options...}' %}
```

### Include a page
```
{% include_page slug '{options...}' %}
```

### Options
Option | Description | Default
--- | --- | ---
`title_level` | Title tag name. `h1~h6` | h2
`title` | Provide a custom title. |
`hide_title` | Whether to hide title. | false
`escape_title` | Whether to escape title. | true
`title_link` | `none` for remove link. |
`expert` | Include expert instead of the full content. | false
`class_name` | Provide class names. |
`merge_tags` | Merge tags. | false
`hide_content` | Whether to hide content(include expert). | false
`collapse_content` | Collapse content panel. | false

### Example
```
{% include_post sub-post %}

{% include_page common-page '{"hide_title": true, "title_link": "none", "expert": false}' %}

{% include_page slug '{"hide_title": true, "title_link": "none", "expert": true, "title": "custom title", "title_level": "h3", "class_name": "classname"}' %}
```

### Demo
TBD

## TODO
- [ ] fix circular reference error.
- [ ] re-render when the included post was updated.
- [ ] test cases.
- [ ] merge tags.

## Similar Include Plugins
- [post_link](https://hexo.io/docs/tag-plugins#Include-Posts)
- [hexo-include-markdown](https://github.com/tea3/hexo-include-markdown)
- [hexo-include](https://github.com/pirtleshell/hexo-include)
- [hexo-custom-fields](https://github.com/loehnertz/hexo-custom-fields)

## License
Copyright (c) 2019 dailylist. Licensed under the [MIT license](https://github.com/dailylist/hexo-tag-include/blob/master/LICENSE).
