document.addEventListener('DOMContentLoaded', () => {
	const nav = document.querySelector('.header__nav');
	const menu = document.querySelector('.header__menu');

	nav.querySelectorAll('.header__menu-slide').forEach((dir) => dir.addEventListener('click', slideMenu));
	function slideMenu(e) {
		const menuItems = menu.querySelectorAll('li');
		const dir = e.currentTarget.classList.contains('header__menu-prev') ? 'prev' : 'next';
		let i;
		const menuOffset = [nav.getBoundingClientRect().left, nav.getBoundingClientRect().width + nav.getBoundingClientRect().left];
		for (i = 0; i < menuItems.length; i++) {
			const elementOffset = [menuItems[i].getBoundingClientRect().left, menuItems[i].getBoundingClientRect().width + menuItems[i].getBoundingClientRect().left];
			if (dir === 'prev' && elementOffset[0] >= menuOffset[0]) {
				i--;
				break;
			} else if (dir === 'next' && elementOffset[1] > menuOffset[1]) {
				break;
			}
		}

		nav.querySelectorAll('.header__menu-slide').forEach((dir) => dir.classList.remove('disabled'));
		if (!menuItems[i + 1] && dir == 'next' || !menuItems[i - 1] && dir == 'prev') { nav.querySelector(`.header__menu-${dir}`).classList.add('disabled'); }
		if (menuItems[i]) {
			const initOffset = new WebKitCSSMatrix(window.getComputedStyle(menu).transform).m41;
			menu.style.transform = `translateX(${initOffset + getInvisibleOffset(menuItems[i])}px)`;
		}
	}

	function getInvisibleOffset(item) {
		const menuOffset = [nav.getBoundingClientRect().left, nav.getBoundingClientRect().width + nav.getBoundingClientRect().left];
		const elementOffset = [item.getBoundingClientRect().left, item.getBoundingClientRect().width + item.getBoundingClientRect().left];
		if (elementOffset[0] < menuOffset[0]) { return (menuOffset[0] - elementOffset[0] + 60); }
		return (elementOffset[1] - menuOffset[1] + 60) * -1;
	}

	const search = document.querySelector('.header__search');
	const resultsWrapper = document.querySelector('.header__search-results');
	const resultsList = resultsWrapper.querySelector('ul');
	search.addEventListener('input', async (e) => {
		resultsWrapper.classList.add('visible');
		resultsWrapper.classList.remove('loaded');
		resultsList.innerHTML = '';
		const res = await fetch('https://jsonplaceholder.typicode.com/todos');
		const items = await res.json();
		resultsWrapper.classList.add('loaded');
		const results = items.filter((item) => item.title.includes(e.target.value));
		if (results.length === 0) {
			resultsList.innerHTML = '<li style="text-align:center">Нет результатов.<br><a href="https://jsonplaceholder.typicode.com/todos">JSON отсюда</a></li>';
		}
		results.forEach((result) => {
			resultsList.innerHTML += `<li>${result.title}</li>`;
		});
	});

	const chooseCity = document.querySelector('.header__city-choose');
	const cityWrapper = document.querySelector('.city__search-wrapper');
	const citiesList = document.querySelector('.city__list');
	const selectedCitiesList = document.querySelector('.city__selected');
	const citySearch = document.querySelector('.city__search');
	let isCitiesLoaded = false;
	chooseCity.addEventListener('click', async () => {
		cityWrapper.classList.toggle('visible');
		if (!isCitiesLoaded) {
			isCitiesLoaded = true;
			citiesList.innerHTML = '';
			cityWrapper.classList.add('loading');
			const res = await fetch('https://jsonplaceholder.typicode.com/todos');
			const items = await res.json();
			cityWrapper.classList.remove('loading');
			items.forEach((item) => {
				citiesList.innerHTML += `<li data-id="${item.id}">${item.title}</li>`;
			});
			const cities = citiesList.querySelectorAll('li');
			cities.forEach((city) => {
				city.addEventListener('click', () => {
					city.classList.toggle('active');
					const alreadySelected = selectedCitiesList.querySelector(`li[data-id="${city.dataset.id}"]`);
					if (alreadySelected) { alreadySelected.remove(); } else { selectedCitiesList.innerHTML += `<li data-id="${city.dataset.id}">${city.innerText}<i class="icon icon-close"></i></li>`; }
					selectedCitiesList.querySelectorAll('li').forEach((item) => {
						item.addEventListener('click', () => {
							item.remove();
							citiesList.querySelector(`li[data-id="${item.dataset.id}"]`).classList.remove('active');
						});
					});
				});
			});
		}
	});
	citySearch.addEventListener('input', (e) => {
		citiesList.querySelectorAll('li').forEach((city) => {
			city.classList.remove('hidden');
			if (!city.innerText.includes(e.target.value)) { city.classList.add('hidden'); }
		});
	});

	const showMobileMenu = document.querySelector('.menu-toggle');
	const closeMobileMenu = document.querySelector('.mobile-close');
	const mobileMenu = document.querySelector('.mobile-menu');
	showMobileMenu.addEventListener('click', toggleMobileMenu);
	closeMobileMenu.addEventListener('click', toggleMobileMenu);

	function toggleMobileMenu() {
		mobileMenu.classList.toggle('visible');
	}
});
