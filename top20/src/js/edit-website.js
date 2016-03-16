'use strict';

(function(root) {
	var categories = {};
	var Data;

	function getCategory(id) {
		id = id.toString();
		for (var i = Data.Categories.length - 1; i >= 0; i--) {
			if (Data.Categories[i].id.toString() === id) {
				return Data.Categories[i];
			}
		}
	}

	function getSubCategory(id, cid) {
		id = id.toString();
		for (var i = Data.SubCategories[cid].length - 1; i >= 0; i--) {
			if (Data.SubCategories[cid][i].id.toString() === id) {
				return Data.SubCategories[cid][i];
			}
		}
	}

	function buildCategories() {
		categories = {};
		var cats = Data.websiteCategories;
		for (var i = cats.length - 1; i >= 0; i--) {
			var cat = cats[i];
			if (cat.indexOf('c0') === 0) {
				cat = cat.substr(3);
				var category = getCategory(cat);
				if (category) {
					categories[category.id] = {
						key: 'c0-' + category.id,
						id: category.id,
						name: category[Data.lang],
						categories: []
					};
				}
			}
		}

		for (var i = cats.length - 1; i >= 0; i--) {
			var cat = cats[i];
			if (cat.indexOf('c1') === 0) {
				cat = cat.substr(3);
				for (var cid in categories) {
					var category = getSubCategory(cat, cid);
					if (category) {
						categories[cid].categories.push({
							key: 'c1-' + category.id,
							id: category.id,
							name: category[Data.lang]
						});
					}
				}
			}
		}

		$(Data.inputSelector).val(cats.join(','));

		return categories;
	}

	function renderCategories() {
		var category;
		var template = '<dl>';
		for (var cid in categories) {
			category = categories[cid];
			template += '<dt>' + (category.name) + ' <span class="remove-category" data-id="' + category.id + '">&#x2715;</span></dt>';
			if (category.categories.length > 0) {
				template += '<dd>';
				for (var i = 0; i < category.categories.length; i++) {
					var cat = category.categories[i];
					template += '<div>' + (cat.name) + ' <span class="remove-category" data-id="' + cat.id + '" data-cid="' + category.id + '">&#x2715;</span></div>';
				}
				template += '</dd>';
			}
		}
		template + '</dl>';

		$(Data.dataSelector).html($(template));

		$('.remove-category', Data.dataSelector).on('click', removeCategoryClick);
	}

	function renderCategoriesSelect() {
		var template = '';
		var category;
		template += '<div class="row">';
		template += '<div class="col-xs-4"><select class="form-control list-categories">';
		for (var i = 0; i < Data.Categories.length; i++) {
			category = Data.Categories[i];
			template += '<option value="' + category.id + '">' + (category[Data.lang]) + '</option>';
		}
		template += '</select></div>';

		template += '<div class="col-xs-5"><select class="form-control list-subcategories"></select></div>';
		template += '<div class="col-xs-3"><a class="add-category" href="#">' + Data.add + '</a></div>';

		template += '</div>';

		$(Data.controlSelector).html($(template));

		var cats = Data.websiteCategories;
		for (var i = 0; i < cats.length; i++) {
			category = cats[i];
			if (category.indexOf('c0-') === 0) {
				$('select.list-categories', Data.controlSelector).val(category.substr(3));
				break;
			}
		}

		$('select.list-categories', Data.controlSelector).on('change', onCategoryChange);
		$('.add-category', Data.controlSelector).on('click', addCategoryClick);

		onCategoryChange();
	}

	function removeByItem(list, item) {
		var index = list.indexOf(item);
		if (index > -1) {
			list.splice(index, 1);
		}
	}

	function removeCategoryClick(evt) {
		evt.preventDefault();
		evt.stopPropagation();

		var element = $(this);
		var id = element.data('id');
		var cid = element.data('cid');
		var categories = Data.websiteCategories;
		var l = categories.length;

		if (cid) {
			removeByItem(categories, 'c1-' + id);
		} else {
			for (var i = Data.SubCategories[id].length - 1; i >= 0; i--) {
				var cat = Data.SubCategories[id][i];
				removeByItem(categories, 'c1-' + cat.id);
			}
			removeByItem(categories, 'c0-' + id);
		}

		if (l !== categories.length) {
			buildCategories();
			renderCategories();
		}
	}

	function addCategoryClick(evt) {
		evt.preventDefault();
		evt.stopPropagation();

		var cid = 'c0-' + $('.list-categories', Data.controlSelector).val();
		var scid = 'c1-' + $('.list-subcategories', Data.controlSelector).val();
		var categories = Data.websiteCategories;
		var l = categories.length;

		if (categories.indexOf(cid) < 0) {
			categories.push(cid);
		}
		if (categories.indexOf(scid) < 0) {
			categories.push(scid);
		}

		if (l !== categories.length) {
			buildCategories();
			renderCategories();
		}
	}

	function onCategoryChange() {
		var cid = $('.list-categories', Data.controlSelector).val();
		var select = $('.list-subcategories', Data.controlSelector);
		var template = '';
		var cats = Data.SubCategories[cid];
		var category;
		for (var i = 0; i < cats.length; i++) {
			category = cats[i];
			template += '<option value="' + category.id + '">' + category[Data.lang] + '</option>';
		}
		select.html($(template));
	}

	root.initEditWebsite = function(data) {
		Data = data;
		data.Categories = data.Categories.sort(function(a, b) {
			return a[data.lang] > b[data.lang];
		});
		buildCategories();
		renderCategories();
		renderCategoriesSelect();
	};

})(window);
