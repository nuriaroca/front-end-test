document.getElementById("searchButton").addEventListener("click", formValidation)

const errorElem = document.getElementById("error")

function formValidation() {

    event.preventDefault()
    let searchElem = document.getElementById("searchInput")
    let searchInput = searchElem.value = searchElem.value.trim()

    if (searchInput.length === 0) {
        errorElem.innerHTML = `<p>Type the username you want to search.</p>`
        errorElem.style.display = "block"
    } else getUser(searchInput)
}

const getUser = async (searchInput) => {

    let loader = document.getElementById("loader");
    loader.style.display = "";
    let container = document.getElementById("formContainer");
    container.style.display = "none";

    const userResponse = await fetch(`https://api.github.com/users/${searchInput}`)
    if (userResponse.status === 200) {

        errorElem.style.display = "none"

        const userData = await userResponse.json()

        let reposData = []
        if (userData.public_repos) {
            document.getElementById("noRepos").style.display = "none";
            const reposResponse = await fetch(`https://api.github.com/users/${searchInput}/repos`)
            reposData = await reposResponse.json()
        } else {
            document.getElementById("noRepos").style.display = "block";
        }

        reposTable(userData, reposData)
        loader.style.display = "none";
        container.style.display = "";

    } else {

        cleanScreen();
        container.style.display = "";
        loader.style.display = "none";
        switch (userResponse.status) {
            case 404:
                errorElem.innerHTML = `<p>This username does not exist.</p>`
                break
            case 403:
                errorElem.innerHTML = `<p>API limit reached./</p>`
                break
            default:
                errorElem.innerHTML = `<p>Try later.</p>`
        }
        errorElem.style.display = "block"
    }
}

const reposTable = (userData, reposData) => {
    const {
        avatar_url,
        login,
        bio,
        name
    } = userData;

    userImage.setAttribute("src", avatar_url);
    username.innerHTML = `@${login}`;
    fullName.innerHTML = name;
    userBio.innerHTML = bio;

    const reposTable = document.getElementById("reposTable");

    reposTable.innerHTML = "";
    reposData.forEach(repo => {
        const {
            name,
            html_url,
            forks_count,
            stargazers_count
        } = repo;
        reposTable.innerHTML += `
              <div class="flex">
                <div class="reposTitle">
                    <h4><a href=${html_url} target="_blank">${name}</a></h4>
                </div>
                <div class="flex">
                    <div>
                        <img class="starimg" src="/style/images/star.png"> ${stargazers_count}
                    </div>
                    <div>
                        <img class="forkimg" src="/style/images/fork.png"> ${forks_count}
                    </div> 
                </div>
              </div>`;
    });
    searchResults.style.display = "block";
};

function cleanScreen() {
    document.getElementById("searchResults").style.display = "none";
}