const url1 = 'https://api.github.com/users/iqbaleff214/repos?sort=updated';
const url2 = 'https://api.github.com/orgs/404NotFoundIndonesia/repos?sort=updated';

const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

const projectContainer = document.getElementById('project-container');
const yearExpContainer = document.getElementById('years-experience');

async function loadProjects() {
    const startYear = 2021;
    const currentYear = new Date().getFullYear();
    yearExpContainer.innerText = currentYear - 2021;

    try {
        const [data1, data2] = await Promise.all([
            (await fetch(url1)).json(),
            (await fetch(url2)).json(),
        ]);
        const repos = [...data1, ...data2];
        repos.sort((a, b) => (new Date(b.updated_at)) - (new Date(a.updated_at)));

        projectContainer.innerHTML = '';
        repos.forEach(repo => {
            projectContainer.innerHTML += template(repo);
        });
    } catch (err) {
        console.log(err);
        projectContainer.innerHTML = `<p>Check out my personal GitHub page at <a href="https://github.com/iqbaleff214">iqbaleff214</a>.</p>`;
    }
}

function template(repo) {
    if (repo.fork) return '';

    if (repo.name.includes('.')) return '';

    const repoFullname = repo.full_name.split('/')[0];

    if (repo.name === repoFullname) return '';

    const startDate = formattedDate.format(new Date(repo.created_at));
    const endDate = formattedDate.format(new Date(repo.updated_at));

    let rangeDate = startDate + " - " + endDate;
    if (startDate === endDate) {
        rangeDate = startDate;
    }

    return `<section class="inside-section">
                <div class="two-column">
                    <div><b><a href="${repo.html_url}">${repo.name}</a></b></div>
                    <div><a href="https://github.com/${repoFullname}">@${repoFullname}</a></div>
                </div>
                <div class="two-column">
                    <div><i>${repo.language ?? '-'}</i></div>
                    <div>${rangeDate}</div>
                </div>
                <div>
                    <i>${repo.topics.join(' | ')}</i>
                </div>
                <p>${repo.description ?? '-'}</p>
            </section>`;
}

loadProjects();
