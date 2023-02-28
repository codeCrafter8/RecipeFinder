const search_icon = document.getElementById('searchIcon');
const search_value = document.getElementById('searchValue');
const container = document.getElementById('container');
let item;
let url;

window.onload = () => {
	item = 'salmon';
	url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`;
	url = 'https://www.themealdb.com/api/json/v1/1/random.php';
	get_recipes();
}

search_icon.onclick = () => {
	item = search_value.value;
	if(item){
		show_information = false;
		container.innerHTML = '';
		search_value.value = '';
		url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`;
		get_recipes();
	}
}

search_value.onkeydown = () => {
	item = search_value.value;
	if(item && event.keyCode == 13)
		search_icon.click();
}

const checkForError = res => {
	if (res.ok) 
        return res.json() 
	return Promise.reject(`Http error: ${res.status}`);
};

function get_recipes(){
	fetch(url)
	.then(checkForError)
    .then(data => {
		console.log(data);
		if(data.meals)
			show_recipes(data.meals);
		else
			show_comment();
    })
    .catch(error => {
        console.log(error);
    })
}

function show_comment(){
	const message = document.createElement('span');
	message.innerHTML = "Ups... We don't have it yet.";
	message.classList.add('message');
	if(mode == 'light_mode')
		message.classList.add('lightMode');
	container.appendChild(message);
}

function show_recipes(data){
	container.innerHTML = '';
	data.forEach(element => {
		const recipe_div = document.createElement('div');
		recipe_div.classList.add('recipeDiv');
		container.appendChild(recipe_div);
		
		const img = document.createElement('img');
		img.src = element.strMealThumb;
		img.classList.add('img');
		recipe_div.appendChild(img);
		
		const fav = document.createElement('div');
		fav.classList.add('fav');
		fav.classList.add('darkColor');
		if(mode == 'light_mode')
			fav.classList.toggle('lightColor');
		fav.innerHTML = `<i class="icon-heart-empty"></i>`;
		let favList = JSON.parse(localStorage.getItem('fav'));
		if(favList != null){
			favList.forEach(el => {
				if(el.idMeal == element.idMeal)
					fav.innerHTML = `<i class="icon-heart"></i>`;
			});
		}
		fav.addEventListener('click', () => add_to_favourites(fav, element));
		recipe_div.appendChild(fav);
		
		const down_div = document.createElement('div');
		down_div.classList.add('downDiv');
		if(mode == 'light_mode'){
			down_div.classList.toggle('lightMode');
			down_div.classList.toggle('lightBorders'); 
			down_div.style.borderTop = 'none';
		}
		recipe_div.appendChild(down_div);
		
		const name_div = document.createElement('div');
		name_div.classList.add('recipeNameDiv');
		down_div.appendChild(name_div);
		
		const name_span = document.createElement('span');
		name_span.classList.add('recipeNameSpan');
		name_span.innerHTML = element.strMeal;
		name_span.onclick = () => show_instruction(element);
		name_div.appendChild(name_span);
		
		const details_div = document.createElement('div');
		details_div.classList.add('detailsDiv');
		down_div.appendChild(details_div);
		
		const span_origin = document.createElement('span');
		span_origin.classList.add('detailsText');
		span_origin.innerHTML = `<i class="icon-location"></i>` + element.strArea;
		details_div.appendChild(span_origin);
		
		const span_category = document.createElement('span');
		span_category.classList.add('detailsText');
		span_category.innerHTML = `<i class="icon-tag"></i>` + element.strCategory;
		details_div.appendChild(span_category);
		
		const tags_div = document.createElement('div');
		tags_div.classList.add('tagsDiv');
		down_div.appendChild(tags_div);
		
		create_tags(element, tags_div);
	});
}

const fav_div = document.getElementById('favDiv');
fav_div.addEventListener('click', see_favourites);

function add_to_favourites(fav, element){
	let favList = JSON.parse(localStorage.getItem('fav'));
	if(favList == null)
		favList = [];
	if(fav.querySelectorAll('.icon-heart').length == 0){
		fav.innerHTML = `<i class="icon-heart"></i>`;
		favList.push(element);
	}
	else{
		fav.innerHTML = `<i class="icon-heart-empty"></i>`;
		favList.forEach((el, index) => {
			if(el.idMeal == element.idMeal)
				favList.splice(index, 1);
		});
	}
	fav.classList.add('darkColor');
	if(mode == 'light_mode' && !fav.classList.contains('lightColor'))
		fav.classList.toggle('lightColor');
	localStorage.setItem('fav', JSON.stringify(favList));
}

function see_favourites(){
	let favList = JSON.parse(localStorage.getItem('fav'));
	if(favList)
		show_recipes(favList);
}

function create_tags(element, tags_div){	
	if(element.strTags){
		const tag_array = element.strTags.split(',');
		tag_array.forEach(el => {
			if(el != ""){
				const tag = document.createElement('div');
				tag.classList.add('tag');
				if(mode == 'light_mode'){
					tag.classList.toggle('lightMode');
					tag.classList.toggle('lightBorders');
				}
				tag.innerHTML = el;
				const len = el.length;
				if(len > 3)
					tag.style.width = el.length * 10 +'px';
				else if(len > 0)
					tag.style.width = '40px';
				tags_div.appendChild(tag);
			}
		});
	}
}
 
function show_instruction(element){
	const inst_div = document.createElement('div');
	inst_div.classList.add('instructionContainer');
	if(mode == 'light_mode'){
		inst_div.classList.toggle('lightMode');
		inst_div.classList.toggle('lightBorders');
	}
	const window_top = window.pageYOffset;
	let value = 42;
	if(window_top > 0)
		value = 20;
	inst_div.style.top = window_top + value + 'px';
	document.body.appendChild(inst_div);
	
	const left_container = document.createElement('div');
	left_container.classList.add('left');
	inst_div.appendChild(left_container);
	
	const name_div = document.createElement('div');
	name_div.classList.add('instructionRecipeName');
	name_div.innerHTML = element.strMeal;
	left_container.appendChild(name_div);
	
	const img = document.createElement('img');
	img.src = element.strMealThumb;
	img.classList.add('instructionImg');
	left_container.appendChild(img);
	
	const ingredient_container = document.createElement('div');
	ingredient_container.classList.add('instructionIngredientContainer');
	left_container.appendChild(ingredient_container);
	
	create_list_of_ingredients(element, ingredient_container);
	
	const right = document.createElement('div');
	right.classList.add('right');
	inst_div.appendChild(right);
	
	const inst_text = document.createElement('div');
	inst_text.classList.add('instructionText');
	if(mode == 'light_mode'){
		inst_text.classList.toggle('lightMode');
		inst_text.classList.toggle('lightBorders');
	}
	
	create_instruction_text(element, inst_text, inst_div);
	
	right.appendChild(inst_text);

	const method = document.createElement('div');
	method.classList.add('method');
	
	const method_text = document.createElement('div');
	method_text.classList.add('methodText');
	if(mode == 'light_mode')
		method_text.classList.toggle('lightMode');
	method_text.innerHTML = 'Directions';
	method.appendChild(method_text);
	inst_text.appendChild(method);
	
	const close_button = document.createElement('button');
	close_button.classList.add('closeButton');
	close_button.innerHTML = `<i class="icon-cancel"></i>`;
	if(mode == 'light_mode')
		close_button.classList.toggle('lightMode');
	close_button.onclick = () => close();
	right.appendChild(close_button);
}

function create_list_of_ingredients(element, ingredient_container){
	let i = 1;
	let ingredient = 'strIngredient' + i;
	let quantity = 'strMeasure' + i;
	
	while(element[`${ingredient}`] != ""){
		const ingredient_div = document.createElement('div');
		ingredient_div.classList.add('instructionIngredientDiv');
		if(mode == 'light_mode'){
			ingredient_div.classList.toggle('lightMode');
			ingredient_div.classList.toggle('lightBorders');
		}
		ingredient_container.appendChild(ingredient_div);
		
		const ingredient_name = document.createElement('div');
		ingredient_name.classList.add('instructionIngredientName');
		ingredient_name.innerHTML = element[`${ingredient}`];
		ingredient_div.appendChild(ingredient_name);
		
		const ingredient_quantity = document.createElement('div');
		ingredient_quantity.classList.add('instructionIngredientQuantity');
		if(mode == 'light_mode')
			ingredient_quantity.classList.toggle('lightMode');
		if(element[`${quantity}`].length > 30){
			ingredient_quantity.style.height = '45px';
			ingredient_div.style.height = '45px';
			ingredient_quantity.style.fontSize = '10px';
		}
		ingredient_quantity.innerHTML = element[`${quantity}`];
		ingredient_div.appendChild(ingredient_quantity);
		
		i++;
		ingredient = 'strIngredient' + i;
		quantity = 'strMeasure' + i;
	}
}

function create_instruction_text(element, inst_text, inst_div){
	let text = '';
	let j = 1;
	const text_array = element.strInstructions.split('.');
	text_array.pop();
	text_array[0] = text_array[0].padStart(text_array[0].length + 1);
	let len = 0;
	text_array.forEach(el => {
		if(j > 9)
			len = el.length + 3;
		else
			len = el.length + 2;
		text = `<span class="point">` + text + el.padStart(len, j + '.') + '.' + `</span>`;
		j++;
	});
	inst_text.innerHTML = text;
	if(text_array.length > 11){
		inst_text.style.height = text_array.length * 50 + 'px';
		inst_div.style.height = text_array.length * 60 + 'px';
	}
}

function close(){
	const inst_div = document.getElementsByClassName('instructionContainer');
	Array.from(inst_div).forEach(el => el.style.visibility = 'hidden');
}

let mode = 'dark_mode';

const modeDiv = document.getElementById('mode');
modeDiv.innerHTML = `<i class="icon-${mode}"></i>`;

modeDiv.onmouseenter = () => {
	if(mode == 'dark_mode')
		modeDiv.innerHTML = `<i class="icon-light_mode"></i>`;
	else
		modeDiv.innerHTML = `<i class="icon-dark_mode"></i>`;
}

modeDiv.onmouseleave = () => {
	modeDiv.innerHTML = `<i class="icon-${mode}"></i>`;
}

modeDiv.onclick = () => {
	if(mode == 'light_mode')
		mode = 'dark_mode';
	else
		mode = 'light_mode';
	modeDiv.innerHTML = `<i class="icon-${mode}"></i>`;
	document.body.classList.toggle('lightMode');
	search_value.classList.toggle('lightMode');
	Array.from(document.getElementsByClassName('downDiv')).forEach(el => {el.classList.toggle('lightMode'); el.classList.toggle('lightBorders');
	el.style.borderTop = 'none'});
	document.getElementById('mode').classList.toggle('lightMode');
	document.getElementById('favDiv').classList.toggle('lightMode');
	Array.from(document.getElementsByClassName('message')).forEach(el => el.classList.toggle('lightMode'));
	Array.from(document.getElementsByClassName('fav')).forEach(el => el.classList.toggle('lightColor'));
	Array.from(document.getElementsByClassName('tag')).forEach(el =>{el.classList.toggle('lightMode'); el.classList.toggle('lightBorders');});
	search_icon.classList.toggle('lightMode');
}