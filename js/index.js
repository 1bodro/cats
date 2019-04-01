/* async load json with info */

var loadContent = async function loadContent(url, callback) {
	await fetch(url)
		.then(function (response) {
			return response.json();
		})
		.then(function (json) {
			return createElement(json.cards);
		});
	callback();
};
/* Make product card */

function createElement(arr) {
	var cardsWrapper = document.querySelector('.cards');
	arr.forEach(function (item) {
		var card = document.createElement('div'),
			portion = '',
			mouse = '',
			weightCard,
			number,
			cases = [2, 0, 1, 1, 1, 2];
		card.classList.add('card');
		card.classList.add('flex-column');

		/* content creation depending on card data */

		if (item.portionCount > 1000 || item.portionCount <= 0 || typeof item.portionCount !== 'number') {
			portion = 'Количество порций уточняйте';
		} else {
			var masPortion = ['порция', 'порции', 'порций'];
			number = item.portionCount;
			portion = number + ' ' + masPortion[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
		}
		if (item.mouseCount > 1000 || item.mouseCount <= 1 || typeof item.mouseCount !== 'number') {
			mouse = 'мышь в подарок';
		} else {
			var masMouse = ['мышь', 'мыши', 'мышей'];
			number = item.mouseCount;
			mouse = number + ' ' + masMouse[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]] + ' в подарок';
		}
		if (item.weight > 90 || item.mouseCount <= 0 || typeof item.weight !== 'number') {
			weightCard = '?';
		} else {
			weightCard = item.weight;
		}

		/* create card */

		card.innerHTML = `
        <div class="card__container flex-column" data-balance="${item.balance}">
                    <div class="card__header">
                        <div class="card__header__corner">
                            <span class="card__header__border"></span>
                        </div>
                        <span class="card__header__slogan">${item.slogan}</span>
                    </div>
                    <div class="card__body flex-column">
                        <span class="card__body__border"></span>
                        <h3 class="card__name">${item.name}</h3>
                        <span class="card__descr">${item.descr}</span>
                        <ul class="card__content">
                            <li class="portionСount">${portion}</li>
                            <li class="mouseCount">${mouse}</li>
                            <li class="joke">${item.joke}</li>
                        </ul>
                        <img src="img/cat.png" alt="cat" class="card__cat">
                        <div class="card__weight flex-column">
                            <span class="card__weight__value">${weightCard}</span>
                            <span class="card__weight__unit">кг</span>
                        </div>
                    </div>
                </div>
                <div class="card__footer">
                    <div class="buy-case" data-title="${item.title}">
                        <span class="buy-case__text">Чего сидишь? Порадуй котэ, </span><a href="/" class="buy-case__link" > купи.</a>
                    </div>
                </div>
        `
		cardsWrapper.appendChild(card);
	});
}

/* callback func after load product card (js/db.json) */

loadContent('js/db.json', function () {
	var cards = document.querySelectorAll('.card');
	cards.forEach(function (card) {

		/* DOM param */

		var countClick = 1,
			colorClick = "#d91667",
			colorNone = "#b3b3b3",
			cardContainer = card.querySelector('.card__container'),
			balance = cardContainer.getAttribute('data-balance'),
			buyConst = card.querySelector('.buy-case__text').innerHTML,
			buyText = card.querySelector('.buy-case__text'),
			buyTittle = card.querySelector('.buy-case').getAttribute('data-title'),
			slogan = card.querySelector('.card__header__slogan'),
			sloganText = slogan.textContent,
			cardDescr = card.querySelector('.card__descr'),
			imgCard = card.querySelector('.card__cat'),
			weightCircle = card.querySelector('.card__weight'),
			value = card.querySelector('.card__weight__value'),
			borderBody = card.querySelector('.card__body__border'),
			borderHeader = card.querySelector('.card__header__slogan'),
			borderCorner = card.querySelector('.card__header__border'),
			buyLink = card.querySelector('.buy-case__link');

		/* checking the availability of goods */

		if (!Number.isNaN(+balance) && balance !== " " && +balance > 0) {
			weightCircle.style.backgroundColor = '';
			borderBody.style.borderColor = '';
			borderHeader.style.borderColor = '';
			borderCorner.style.borderColor = '';
			buyLink.style.display = 'block';
			imgCard.style.opacity = '';
			buyText.innerHTML = buyConst;
			buyText.style.color = '';
			slogan.style.color = '';
			card.querySelector('.card__content').style.color = '';
			card.style.color = '';

			/* event */

			cardContainer.addEventListener('click', clickCard);
			buyLink.addEventListener('click', clickCard);
			card.addEventListener('mouseleave', hoverOff);
		} else {

			/* create blocked card */

			weightCircle.style.backgroundColor = colorNone;
			borderBody.style.borderColor = colorNone;
			borderHeader.style.borderColor = colorNone;
			borderCorner.style.borderColor = colorNone;
			slogan.style.color = colorNone;
			card.querySelector('.card__content').style.color = colorNone;
			card.style.color = colorNone;
			buyLink.style.display = 'none';
			imgCard.style.opacity = '.5';
			buyText.textContent = `Печалька, ${cardDescr.textContent} закончились`;
			buyText.style.color = '#ff6';
		}

		function clickCard() {
			if (countClick) {

				/* create clicked card */

				weightCircle.style.backgroundColor = colorClick;
				borderBody.style.borderColor = colorClick;
				borderHeader.style.borderColor = colorClick;
				borderCorner.style.borderColor = colorClick;
				buyLink.style.display = 'none';
				buyText.textContent = buyTittle;
				countClick = 0;
			} else {

				/* create unclicked card */

				weightCircle.style.backgroundColor = '';
				borderBody.style.borderColor = '';
				borderHeader.style.borderColor = '';
				borderCorner.style.borderColor = '';
				buyText.innerHTML = buyConst;
				slogan.textContent = sloganText;
				buyLink.style.display = 'block';
				slogan.style.color = '';
				countClick = 1;
			}

			return false;
		}

		function hoverOff() {
			if (!countClick) {
				slogan.textContent = 'Котэ не одобряет?';
				slogan.style.color = colorClick;
			}
		}
	});
});
