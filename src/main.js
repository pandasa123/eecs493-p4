const API_KEY = '3b81c2616409f777463ed01d9c27105f'

let vcomp = new Vue({
	el: '#container',
	data: {
		currentDate: '',
		currentInterestingIndex: 0,
		currentInterestingSet: [],
		imgSet: [],
		currentGallery: [],
		currentCarouselIndex: 0
	},
	methods: {
		fetchInterestingSet(daysFromYesterday) {
			let currentDate = new Date()
			currentDate.setDate(currentDate.getDate() - 1 - daysFromYesterday)

			textDate = currentDate
				.toJSON()
				.slice(0, 10)
				.replace(/-/g, '-')

			this.currentDate = textDate

			let url =
				'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=' +
				API_KEY +
				'&date=' +
				textDate +
				'&per_page=10&format=json&nojsoncallback=1'

			fetch(url)
				.then(res => {
					res.json().then(data => {
						this.currentInterestingSet = data.photos.photo
						let tempImgSet = []

						for (let i = 0; i < data.photos.photo.length; i++) {
							let src =
								'https://farm' +
								data.photos.photo[i].farm +
								'.staticflickr.com/' +
								data.photos.photo[i].server +
								'/' +
								data.photos.photo[i].id +
								'_' +
								data.photos.photo[i].secret +
								'_c.jpg'
							tempImgSet.push(src)
						}

						this.imgSet = tempImgSet
					})
				})
				.catch(err => console.log(err))
		},
		getCurrentActive() {
			this.currentCarouselIndex = parseInt(
				document
					.getElementsByClassName('carousel-inner')[0]
					.getElementsByClassName('active')[0]
					.querySelector('img')
					.getAttribute('bs-index')
			)
			return this.currentCarouselIndex
		},
		removeAddActive() {
			document
				.getElementsByClassName('carousel-inner')[0]
				.getElementsByClassName('active')[0]
				.classList.remove('active')
			document
				.getElementsByClassName('carousel-inner')[0]
				.getElementsByClassName('item')[0]
				.classList.add('active')
		}
	},
	beforeMount() {
		this.fetchInterestingSet(0)
	},
	mounted() {
		window.addEventListener('keypress', e => {
			let keypress = String.fromCharCode(e.keyCode)
			if (keypress === '3') {
				this.currentInterestingIndex += 1
				this.fetchInterestingSet(this.currentInterestingIndex)
			} else if (keypress === '1') {
				this.currentInterestingIndex = 0
				this.fetchInterestingSet(0)
				this.removeAddActive()
			}
		})
	}
})
