const escapeHtml = require('escape-html');
const Post = hexo.model('Post');
const Page = hexo.model('Page');
const route = hexo.route;
const promises = {};
const config = hexo.config;
const defaultOption = {
	"title_level": "h2",
	// "title": "custom title",
	"hide_title": false,
	"escape_title": true,
	// "title_link": "none",
	"expert": false,
	// "class_name": "custom class",
	"merge_tags": false
};

/**
 * Syntax:
 * {% include_post slug '{options...}' %}
 * e.g.
 * {% include_post sub-post '{"hide_title": true, "title_link": "none", "expert": true, "title": "custom title", "title_level": "h3", "class_name": "classname"}' %}
 */
hexo.extend.tag.register('include_post', function(args) {
	// console.log(args)
	const slug = args[0];

	const post = Post.findOne({
		slug
	});
	// console.log(post);
	return include('post', slug, post, args[1]);
}, {
	async: true
});

/**
 * Syntax:
 * {% include_page slug '{options...}' %}
 * e.g.
 * {% include_page sub-page '{"hide_title": true, "title_link": "none", "expert": true, "title": "custom title", "title_level": "h3", "class_name": "classname"}' %}
 */
hexo.extend.tag.register('include_page', function(args) {
	// console.log(args)
	const slug = args[0];

	const post = Page.findOne({
		path: slug.endsWith("index.html") ? slug : slug + "/index.html"
	});
	// console.log(post);
	return include('page', slug, post, args[1]);
}, {
	async: true
});

function include(type, slug, post, option) {
	if (!post) return renderNotFound(type, slug);

	if (option) {
		try {
			option = JSON.parse(option);
		} catch (err) {
			console.error(`[include_${type}] Error with option ${option}`);
			option = {};
		}
		option = Object.assign({}, defaultOption, option);
	} else {
		option = Object.assign({}, defaultOption);
	}

	// console.log(post.permalink)
	// console.log(`include_${type} ${post.path}`);
	if (post.content) {
		return render(type, post, option);
	} else {
		return getRenderedData(post.path).then(data => {
			// console.log("=========== async get data " + data.path);
			// console.log(data);
			return render(type, data, option)
		});
	}
}

function getRenderedData(path) {
	return new Promise(function(resolve, reject) {
		pushPromise(path, resolve);
	});
}

function pushPromise(path, resolve) {
	let list = promises[path] = promises[path] || [];
	list.push(resolve);
}

function render(type, data, option) {
	// console.log(option);
	let title = option.title ? option.title : data.title;
	title = option.escape_title ? escapeHtml(title) : title;
	let custonClass = option.class_name ? " " + option.class_name : "";
	let titleStyle = option.hide_title ? ' style="display:none"' : '';
	if (option.title_link === 'none') {
		return `<!-- include_${type} ${data.path} : start --><div class="include_${type}${custonClass}"><${option.title_level} class="title"${titleStyle}>${title}</${option.title_level}><div class="content">${data.content}</div></div><!-- include_${type} ${data.path} : end -->`;
	} else {
		return `<!-- include_${type} ${data.path} : start --><div class="include_${type}${custonClass}"><${option.title_level} class="title"${titleStyle}><a href="${config.root}${data.path}">${title}</a></${option.title_level}><div class="content">${data.content}</div></div><!-- include_${type} ${data.path} : end -->`;
	}
}

function renderNotFound(type, path) {
	return `<!-- include_${type} ${path} : not found -->`;
}

function renderCircularError(type, path) {
	return `<!-- include_${type} ${path} : include error with circular structure -->`;
}

hexo.extend.filter.register('after_post_render', function(data) {
	// console.log("=========== after_post_render " + data.path);
	// console.log(data.path);
	// console.log(data.content);
	if (promises[data.path]) {
		// console.log("=========== after_post_render");
		promises[data.path].forEach(resolve => resolve(data));
		promises[data.path].length = 0;
		promises[data.path] = undefined;
	}
	return data;
});
