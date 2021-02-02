let aboutUs

function setup() {
	// createCanvas(windowWidth, windowHeight);
	noCanvas();
	aboutUs = select(".aboutUs")
	start = new game()
	let grid = document.cookie.split(";").filter(data => data.length > 0)[0].split("=")[1];
	start.loadGrid(grid.split("_"))
	// start.loadGrid([
	// 	"7P2P04P008P00", "000000007P", "003P02P01P00",
	// 	"9P00001P000", "00004P5P003P", "06P07P0004P0",
	// 	"005P8P02P000", "0000003P04P", "8P07P000000"
	// ])
}

function tartget(x, y) {
	for (let current = 1; current <= 9; ++current) {
		let total = 0;
		let up = 0, down = 0;
		let count = 0;
		start.permanent.forEach((d, i) => {
			d.forEach((d1, i1) => {
				if (d1) {
					++count;
					up += (start.grid[i][i1].elt.innerText * 1);
					down += Math.abs(x - i) + Math.abs(y - i1)
					// total += up / down;
					// console.log(x, y, i, i1)
				}
			})
		})
		let res = ((up / down)) * current
			, pos = current / (x + y)
		console.log(current + ": " + res, pos, Math.abs(res - pos));
	}
}