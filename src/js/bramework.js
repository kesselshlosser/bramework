const bramework = {

	config: {
		distPath: '/dist/',
		scrolledClass: 'site-scrolled',
		scrollDownClass: 'site-scroll-down',
		scrollUpClass: 'site-scroll-up',
		touchDeviceClass: 'site-touchdevice',
		notTouchDeviceClass: 'site-not-touchdevice',
		nightClass: 'site-night'
	},

	load() {
		bramework.elements.get();
		bramework.icons.load('icons.min.svg');
		bramework.scroll.load();
		bramework.touch.load();
		bramework.time.load();
		bramework.user.load();
	},

	icons: {
		load(fileName) {
			var svgIcons = new XMLHttpRequest();
			svgIcons.open('GET', bramework.config.distPath+fileName, true);
			svgIcons.send();
			svgIcons.onload = function() {
				var svgIconsContainer = document.createElement('div');
				svgIconsContainer.style.display='none';
				svgIconsContainer.innerHTML = svgIcons.response;
				bramework.body.appendChild(svgIconsContainer);
			}
		}
	},

	scroll: {
		load() {
			window.addEventListener('scroll', bramework.scroll.addClass);
			this.currentScroll  = 0;
			this.previousScroll = 0;
		},

		addClass() {
			if (window.scrollY > 1) {
				bramework.body.classList.add(bramework.config.scrolledClass);
			} else {
				bramework.body.classList.remove(bramework.config.scrolledClass);
			};

			if (this.currentScroll > this.previousScroll) {
				bramework.body.classList.add(bramework.config.scrollDownClass);
				bramework.body.classList.remove(bramework.config.scrollUpClass);
			} else if (this.currentScroll < this.previousScroll) {
				bramework.body.classList.add(bramework.config.scrollUpClass);
				bramework.body.classList.remove(bramework.config.scrollDownClass);
			}

			this.previousScroll = this.currentScroll;
			this.currentScroll = window.scrollY;
		}
	},

	touch : {
		load() {
			var device = ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);

			if (device === true) {
				bramework.body.classList.add(bramework.config.touchDeviceClass);
			} else {
				bramework.body.classList.add(bramework.config.notTouchDeviceClass);
			}
		}
	},

	time: {
		load() {
			this.date = new Date();
			this.hour = this.date.getHours();
			this.now = Date.now();

			if (this.hour > 18 || this.hour < 7) {
				bramework.body.classList.add(bramework.config.nightClass);
			}
		}
	},

	user: {
		load() {
			this.userVisitsCounter = localStorage.getItem((window.location.host) + '_visits');
			this.userLastVisit = localStorage.getItem((window.location.host) + '_lastVisit');

			this.visitsCounter();
			this.lastVisit();
		},

		visitsCounter() {
			if (this.userVisitsCounter) {
				this.userVisitsCounter++;
				localStorage.setItem( (window.location.host) + '_visits', this.userVisitsCounter);
			} else {
				localStorage.setItem( (window.location.host) + '_visits', 1);
			};
			return true;
		},

		lastVisit() {
			this.timeAgo = bramework.time.now - this.userLastVisit;
			localStorage.setItem( (window.location.host) + '_lastVisit', bramework.time.now);
		}
	},

	elements: {
		get() {
			bramework.document = document.documentElement;
			bramework.body = document.body;
			// swibe.menuElement = document.getElementById(swibe.config.menuId);
			// swibe.triggerElement = document.getElementById(swibe.config.triggerId);
		}
	}
}

bramework.load();
