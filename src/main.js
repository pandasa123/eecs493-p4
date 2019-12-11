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
		}
	},
	beforeMount() {
		this.fetchInterestingSet(0)
		console.log(this.currentInterestingSet)
	},
	mounted() {
		window.addEventListener('keypress', e => {
			let keypress = String.fromCharCode(e.keyCode)
			if (keypress === '3') {
				this.currentInterestingIndex += 1
				this.fetchInterestingSet(this.currentInterestingIndex)
			}
		})
	}
})

const loadImagesIntoCarousel = async daysFromYesterday => {
	let res = fetchInterestingSet(daysFromYesterday)
	console.log(res)
	$.each(currentInterestingSet, (i, photo) => {
		let src =
			'https://farm' +
			photo.farm +
			'.staticflickr.com/' +
			photo.server +
			'/' +
			photo.id +
			'_' +
			photo.secret +
			'_c.jpg'
		let active
		if (i === 0) {
			active = ' active'
		} else {
			active = ''
		}
		// Create the img html and set the src attribute to our URL
		let imgHtml = $('<img/>').attr('src', src)
		// Create the .item div and insert the img html into it
		// This is better done in css
		let itemDivHtml = $(
			"<div class='item" + active + "' width='460' height='345'/>"
		).append(imgHtml)
		// Insert the .item div into the .carousel-inner div
		$('.carousel-inner').append(itemDivHtml)
	})
}
