# WEB102 Prework - *Sea Monster Crowdfunding*

Submitted by: **Ayesha Ilyas**

**Sea Monster Crowdfunding** is a website for the company Sea Monster Crowdfunding that displays information about the games they have funded.

Time spent: **10** hours spent in total

## Required Features

The following **required** functionality is completed:

* [x] The introduction section explains the background of the company and how many games remain unfunded.
* [x] The Stats section includes information about the total contributions and dollars raised as well as the top two most funded games.
* [x] The Our Games section initially displays all games funded by Sea Monster Crowdfunding
* [x] The Our Games section has three buttons that allow the user to display only unfunded games, only funded games, or all games.

The following **optional** features are implemented:

* [x] Add a button to the header to quickly navigate to the Our Games section with smooth scrolling.
* [x] Make the stats section responsive for mobile devices. 
* [x] Create a funding progress bar for each game card with a percentage label, where the fill color reflects the game's funding level.
* [x] Design a visual indicator for the active filter.
* [x] Implement a game search feature that finds and displays games based on substring matches in their names and descriptions. Search respects the current filter, displaying only matching games *with the specified funding status*.


## Video Walkthrough

Here's a walkthrough of implemented features:

<img src='smc_walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with [LICEcap](https://www.cockos.com/licecap/) for macOS


## Notes
Connecting the search and filter functionality together took a few tries. Eventually, I decided to use two pieces of global state to define the behavior of the search function. I also refactored the filter functions to use the seach function to display games that match both the current filter and search query.  

## License

    Copyright 2024 Ayesha Ilyas

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
