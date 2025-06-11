document.addEventListener('DOMContentLoaded', () => {

  // --- Button Event Listeners ---
  const colorChangeButton = document.getElementById('clickMeBtn');
  if (colorChangeButton) {
    const colors = [
      '#FFADAD', '#FFD6A5', '#FDFFB6',
      '#CAFFBF', '#9BF6FF', '#A0C4FF',
      '#BDB2FF', '#FFC6FF', '#FFFFFC'
    ];
    let currentIndex = 0;
    colorChangeButton.addEventListener('click', () => {
      document.body.style.backgroundColor = colors[currentIndex];
      currentIndex = (currentIndex + 1) % colors.length;
    });
  }

  const changeTextButton = document.getElementById("change-text-btn");
  if (changeTextButton) {
    changeTextButton.addEventListener("click", function() {
      const mainHeading = document.getElementById("main-heading");
      if (mainHeading) {
        mainHeading.textContent = "I'm a web developer, and I love to code!";
      }
      const bio = document.getElementById("bio");
      if (bio) {
        bio.textContent = "I'm a web developer, and I love to code!";
      }
    });
  }

  // --- Skills Section (works on pages with #skills-section) ---
  const skillsSection = document.getElementById('skills-section');
  if (skillsSection) {
    const skills = ["HTML", "CSS", "JavaScript", "Git/GitHub", "Responsive Design", "Problem Solving"];
    const skillsList = skillsSection.querySelector('ul');
    if (skillsList) {
      skillsList.innerHTML = '';
      for (let i = 0; i < skills.length; i++) {
        const skill = document.createElement('li');
        skill.textContent = skills[i];
        skillsList.appendChild(skill);
      }
    }
  }

  // --- Projects Section (will only run if #projects-section exists) ---
  const projectSection = document.getElementById('projects-section');
  if (projectSection) {
    const githubUsername = 'B-J-R-C';
    const githubApiUrl = `https://api.github.com/users/${githubUsername}/repos`;
    fetch(githubApiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(repositories => {
        const projectList = projectSection.querySelector('ul');
        projectList.innerHTML = '';
        for (let i = 0; i < repositories.length; i++) {
          const project = document.createElement('li');
          project.innerHTML = `<a href="${repositories[i].html_url}" target="_blank">${repositories[i].name}</a>`;
          projectList.appendChild(project);
        }
      })
      .catch(error => {
        console.error('There was a problem fetching the projects:', error);
        const projectList = projectSection.querySelector('ul');
        projectList.innerHTML = '<li>Could not load projects at this time.</li>';
      });
  }

  // --- Leave a Message Section (will only run if the form exists) ---
  const addFormEl = document.getElementById('addUserForm');
  if (addFormEl) {
    const loadingEl = document.getElementById('loading');
    const userListEl = document.getElementById('userList');
    const MESSAGE_API_URL = 'https://jsonplaceholder.typicode.com/users';

    const loadUsers = async () => {
      if (!userListEl) return;
      try {
        loadingEl.style.display = 'block';
        const response = await fetch(MESSAGE_API_URL);
        if (!response.ok) throw new Error(`Failed to load (${response.status})`);
        const users = await response.json();
        userListEl.innerHTML = '';
        users.forEach(user => {
          const messageItem = document.createElement('li');
          messageItem.dataset.name = user.name;
          messageItem.dataset.email = user.email;
          const textSpan = document.createElement('span');
          textSpan.innerHTML = `<strong>${user.name}</strong> — <a href="mailto:${user.email}"><em>${user.email}</em></a>`;
          messageItem.appendChild(textSpan);
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'button-container';
          const editButton = document.createElement('button');
          editButton.innerText = 'Edit';
          editButton.type = 'button';
          editButton.className = 'edit-btn';
          editButton.addEventListener('click', handleEdit);
          buttonContainer.appendChild(editButton);
          const removeButton = document.createElement('button');
          removeButton.innerText = 'Remove';
          removeButton.type = 'button';
          removeButton.className = 'remove-btn';
          removeButton.addEventListener('click', function() { this.closest('li').remove(); });
          buttonContainer.appendChild(removeButton);
          messageItem.appendChild(buttonContainer);
          userListEl.appendChild(messageItem);
        });
      } catch (err) {
        userListEl.innerHTML = `<li style="color:red">Error: ${err.message}</li>`;
      } finally {
        loadingEl.style.display = 'none';
      }
    };

    const handleEdit = () => {
      const entry = event.target.closest('li');
      const currentName = entry.dataset.name;
      const currentEmail = entry.dataset.email;
      const currentMessage = entry.dataset.message || "";
      const newName = prompt("Edit name:", currentName);
      const newEmail = prompt("Edit email:", currentEmail);
      const newMessage = prompt("Edit message:", currentMessage);
      if (newName !== null && newEmail !== null && newMessage !== null) {
        entry.dataset.name = newName.trim();
        entry.dataset.email = newEmail.trim();
        entry.dataset.message = newMessage.trim();
        let messageContent = `<strong>${newName.trim()}</strong> — <a href="mailto:${newEmail.trim()}"><em>${newEmail.trim()}</em></a>`;
        if (newMessage.trim()) {
          messageContent += `<br><small>"${newMessage.trim()}"</small>`;
        }
        entry.querySelector('span').innerHTML = messageContent;
      }
    };

    addFormEl.addEventListener('submit', async event => {
      event.preventDefault();
      const name = addFormEl.userName.value.trim();
      const message = addFormEl.userMessage.value.trim();
      const email = addFormEl.email.value.trim();
      if (!name || !email || !message) {
        return alert('Please fill in all fields.');
      }
      loadingEl.textContent = 'Adding message…';
      loadingEl.style.display = 'block';
      try {
        const res = await fetch(MESSAGE_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        });
        if (!res.ok) throw new Error(`Create failed (${res.status})`);
        const newUser = await res.json();
        const newMessageEl = document.createElement('li');
        newMessageEl.dataset.name = newUser.name;
        newMessageEl.dataset.email = newUser.email;
        newMessageEl.dataset.message = message;
        const textSpan = document.createElement('span');
        textSpan.innerHTML = `<strong>${newUser.name}</strong> — <a href="mailto:${newUser.email}"><em>${newUser.email}</em></a><br><small>"${message}"</small>`;
        newMessageEl.appendChild(textSpan);
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.type = 'button';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', handleEdit);
        buttonContainer.appendChild(editButton);
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.type = 'button';
        removeButton.className = 'remove-btn';
        removeButton.addEventListener('click', function() { this.closest('li').remove(); });
        buttonContainer.appendChild(removeButton);
        newMessageEl.appendChild(buttonContainer);
        userListEl.appendChild(newMessageEl);
        addFormEl.reset();
      } catch (err) {
        alert(`Error: ${err.message}`);
      } finally {
        loadingEl.textContent = 'Loading messages…';
        loadingEl.style.display = 'none';
      }
    });

    // Initial load of messages
    loadUsers();
  }

  // --- Footer (runs on all pages) ---
  const footerElement = document.createElement('footer');
  const copyrightParagraph = document.createElement('p');
  const thisYear = new Date().getFullYear();
  copyrightParagraph.textContent = `© Ben Chapman ${thisYear}`;
  footerElement.appendChild(copyrightParagraph);
  document.body.appendChild(footerElement);
});