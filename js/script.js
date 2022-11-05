const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const repos = document.getElementById('repos');

const API = 'https://api.github.com/users/';

async function getUser(username) {
	try {
		const { data } = await axios(API + username);
		createUserCard(data);
        getRepos(username);
	} catch (err) {
		if (err.response.status == 404){
            notFoundCard('username not found')
        }
	}
}

async function getRepos(username) {
	try {
		const { data } = await axios(API + username + '/repos?sort=created');
		addRepos(data);
	} catch (err) {
        notFoundCard('repos not found')
	}
}

function notFoundCard(message){
    const cardHTML = `
        <div class="card">
            <h1>${message}</h1>
        </div>
    `
    main.innerHTML = cardHTML
}

function addRepos(repos){
    const repo_ele = document.getElementById('repositories')

    repos
    .slice(0,3)
    .forEach(repo => {
        const rep_ele = document.createElement('a')
        rep_ele.classList.add('repos')
        rep_ele.href = repo.html_url
        rep_ele.target = '_blank'
        rep_ele.innerText = repo.name

        repo_ele.appendChild(rep_ele)
    })

    
}

function createUserCard(username) {
    let date = new Date(Date.parse(username.created_at))
	const cardHTML = `
    <div class="card">
            
    <div>
        <img src=${username.avatar_url} alt="${username.name}" class="avatar">
    </div>

    <div class="user-info">
        <div class="links">
            <div>
                <h2>${username.name}</h2>
                <p>@${username.login}</p>
                <p>twitter: ${username.twitter_username}</p>
            </div>
            
            <div class="btn"><a href="https://github.com/${username.login}">Visit Profile</a></div>
        </div>
        

        <p>${username.bio}</p>

        <ul>
            <li>${username.followers} <strong>Followers</strong></li>
            <li>${username.following} <strong>Following</strong></li>
            <li>${username.public_repos} <strong>Repos</strong></li>
        </ul>

        <p>Recent Repos:
        <div id="repositories"></div>
        </p>
        

        <p>Date Created: ${date}</p>
    </div>

</div>
    `;

	main.innerHTML = cardHTML;
}

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const user = search.value;
	if (user) {
		getUser(user);
		search.value = '';
	}
});