let aboutUs

function setup() {
	// createCanvas(windowWidth, windowHeight);
	noCanvas();
	aboutUs = select(".aboutUs")
	start = new game()
	let grid = document.cookie.split(";").filter(data => data.length > 0)[0].split("=")[1];
	start.loadGrid(grid.split("_"))
}