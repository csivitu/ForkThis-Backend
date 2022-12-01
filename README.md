<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/csivitu/Template">
    <img src="https://csivit.com/images/favicon.png" alt="Logo" width="80">
  </a>

  <h3 align="center">ForkThis</h3>

  <p align="center">
    To live and breathe open source
  </p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Usage](#usage)
* [Contributing](#contributing)
* [Contributors](#contributors)


<!-- ABOUT THE PROJECT -->
## About The Project

A website for CSI-VIT's ForkThis, which was a Github workshop followed by a 3 day event wherein participants were supposed to solved the issues raised in the given CSI-VIT's projects, for which they were awarded points which were used to buy items available in the shop and to maintain the leaderboards. A complete track of participant's progress was also shown on the dashboard using Chart-JS.

<strong> This Repository contains only the Backend of the project. </strong>


### Built With

* React JS
* Express JS
* Node Scheduler
* Github OAuth
* Github Webhooks
* Tailwind CSS
* MongoDB
* Chart JS


<!-- USAGE EXAMPLES -->
## Usage
<div>
<img src="/screenshots/Landing_Page.jpg" width="400px;" alt=""/>
<p>1. The website opens here at the landing page where you are asked to sign up, which takes you to CSI Accounts page and then you are asked to authenticate using Github.</p>
</div>

<div>
<img src="/screenshots/Home_Page_1.jpg" width="400px;" alt=""/>
<img src="/screenshots/Landing_Page_2.jpg" width="400px;" alt=""/>
<p>2. After the Login is complete, the tokens are stored in cookies, and the user lands onto the home page. Here all the data of the PRs merged is presented against the time, difficulty and the tags, and a recents section to display the 10 most recent acitivies of our participants, which include filing a PR, getting a PR merged and raising an issue.<br/> 
<img src="/screenshots/Leaderboards.jpg" width="400px;" alt=""/>
<br/>
Then we also have a leaderboards section here to display the participants sorted based on their points.</p>
</div>

<div>
<img src="/screenshots/Shop.jpg" width="400px;" alt=""/>
<p>3. Heading onto shop, we have item such as tshirts, pens, bags, etc which can be bought using the coins the user is awarded upon getting a PR merged and winning challenges. 
<img src="/screenshots/Purchased_Items.jpg" width="400px;" alt=""/>
<br/>
The purchased items can be viewed in the purchased section.</p>
</div>

<div>
<img src="/screenshots/Create_Challenge.jpg" width="400px;" alt=""/>
<p>4. The most intriguing feature which adds life to this event is Challenges. You can raise a challenge wherein you specify it's duration, tags of the issues to be solved under this challenge and coins the participant is willing to bet on this challenge. Once the challenge is up it shows up in the Open Challenges section and other participants can accept it. Once a challenge is accepted, the complete tack of both the users' activity is displayed but the final score of the opponent is disclosed when the challenge ends and the coins bet are reduced from the losing player and are added to the winner. Both the participants need to solve issues under the specified tags of the challenge to collect points and compete. After the challenge ends, it gets pushed to the closed challenges section. </p>
</div>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push -u origin feature/AmazingFeature`)
5. Open a Pull Request

You are requested to follow the contribution guidelines specified in [CONTRIBUTING.md](./CONTRIBUTING.md) while contributing to the project :smile:.


## Contributors

<table>
  <tr>
    <td align="center"><a href="https://github.com/Pratham-Mishra04"><img src="https://avatars.githubusercontent.com/u/99235987?s=400&v=4" width="100px;" alt=""/><br /><sub><b>Pratham Mishra</b></sub></a><br /></td>
  </tr>
</table>
