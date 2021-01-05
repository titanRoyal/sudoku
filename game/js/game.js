class game {
    constructor() {
        this.grid = []
        this.stop = false;
        this.counter = 0;
        this.permanentCount = 0;
        this.permanent = []
        this.State = []
        for (let i = 0; i < 9; i++) {
            this.grid[i] = []
            this.permanent[i] = []
            for (let i1 = 0; i1 < 9; i1++) {
                this.permanent[i][i1] = false;
                this.grid[i][i1] = select("." + i + "_" + i1);
                this.grid[i][i1].mousePressed(() => {
                    // if (this.grid[i][i1].elt.innerText == "") return;;
                    if (!this.permanent[i][i1]) {
                        this.inc(i, i1);
                        this.update();
                    }
                })
            }

        }
    }
    loadGrid(grid = JSON.parse(localStorage.getItem("grid")).grid) {
        this.permanentCount = 0;
        grid.forEach((row, x) => {
            let y = 0;
            for (let i = 0; i < row.length; i++) {
                if (row[i] == "P") continue;
                // console.log(row[i], row[i + 1])

                if (row[i] != 0) {
                    if (row[i + 1] == "P") {
                        this.permanentCount++;
                        this.permanent[x][y] = true;
                        this.setPermanent(x, y, row[i] * 1)
                    } else {
                        this.permanent[x][y] = false;
                        this.set(x, y, row[i] * 1)
                    }
                } else {
                    this.permanent[x][y] = false;
                    this.set(x, y)
                }
                y = (y + 1) % 10;

            }
        })
    }
    saveGrid(save = false) {
        let temp = []
        for (let i = 0; i < 9; i++) {
            let str = ""
            for (let i1 = 0; i1 < 9; i1++) {
                str += this.grid[i][i1].elt.innerText || 0;
                if (this.permanent[i][i1]) str += "P"
            }
            temp.push(str);
        }
        if (save) {
            return temp;
        } else {

            localStorage.setItem("grid", JSON.stringify({
                grid: temp,
                permanentCount: this.permanentCount
            }))
        }
    }
    randomize() {
        for (let i = 0; i < 9; i++) {
            for (let i1 = 0; i1 < 9; i1++) {
                if (!this.permanent[i][i1]) {
                    this.grid[i][i1].elt.innerText = Math.floor(Math.random() * 10);
                }
            }
        }
        this.update()
    }
    setPermanent(i, j, val) {
        ++this.permanentCount;
        // let pos = i * 9 + j;
        // this.small[pos].innerText = val % 10;
        this.permanent[i][j] = true;
        this.grid[i][j].elt.innerText = val;
        this.grid[i][j].style("background:white;color:#34495e")
    }
    set(i, j, val = 0) {
        // let pos = i * 9 + j;
        // this.small[pos].innerText = val % 10;
        if (val) {

            this.grid[i][j].elt.innerText = val;
        } else {
            this.grid[i][j].elt.innerText = "";
            this.grid[i][j].style("background:#34495e;color:white")
        }
    }
    checkcell(i, j) {
        // console.log(i, j)
        let value = this.grid[i][j].elt.innerText;
        for (let x = 0; x < 9; x++) {
            if (x != i && this.grid[x][j].elt.innerText == value) return false;
            if (x != j && this.grid[i][x].elt.innerText == value) return false;
        }
        for (let x = Math.floor(i / 3) * 3; x < Math.floor(i / 3) * 3 + 3; x++) {
            for (let y = Math.floor(j / 3) * 3; y < Math.floor(j / 3) * 3 + 3; y++) {
                if (x == i && y == j) continue;
                // console.log(x, y, this.grid[x][y].elt.innerText)
                if (this.grid[x][y].elt.innerText == value) return false;

            }

        }
        return true;
    }
    inc(i, j) {
        let val = this.grid[i][j].elt.innerText;
        if (val == "9") {
            this.grid[i][j].elt.innerText = ""
            this.grid[i][j].style("background:#34495e")
        } else {
            this.grid[i][j].elt.innerText = (this.grid[i][j].elt.innerText * 1 + 1) % 10
        }
    }
    dec(i, j) {
        let val = this.grid[i][j].elt.innerText;
        if (val == "1") {
            this.grid[i][j].elt.innerText = 9
            // this.grid[i][j].style("background:#34495e")
        } else {
            this.grid[i][j].elt.innerText = this.grid[i][j].elt.innerText * 1 - 1
        }
    }
    update() {
        for (let i = 0; i < 9; i++) {
            for (let i1 = 0; i1 < 9; i1++) {
                // debugger;
                if (this.grid[i][i1].elt.innerText == "") continue;
                if (this.permanent[i][i1]) continue;
                if (!this.checkcell(i, i1)) {
                    this.grid[i][i1].style(`background:#e74c3c;
													color:white;`)
                } else {
                    this.grid[i][i1].style(`background:#2ecc71;
													color:white`)
                }
            }

        }
    }
    solve() {
        let dir = {}
        let find = false;
        for (let ii = 0; ii < 81; ii++) {
            let i = Math.floor(ii / 9);
            let i1 = ii % 9;

            if (!this.permanent[i][i1] && this.grid[i][i1].elt.innerText == "") {
                let arr = new Array(9).fill().map((data, index) => index + 1);
                for (let i3 = 0; i3 < 9; i3++) {
                    let val = this.grid[i3][i1].elt.innerText * 1;
                    let val1 = this.grid[i][i3].elt.innerText * 1;
                    if (val) arr[val - 1] = undefined;
                    if (val1) arr[val1 - 1] = undefined;

                }
                let startX = Math.floor(i / 3) * 3,
                    startY = Math.floor(i1 / 3) * 3;
                for (let x = startX; x < (startX + 3); x++) {
                    for (let y = startY; y < (startY + 3); y++) {
                        // if (x == i && y == i1) continue;
                        let val = this.grid[x][y].elt.innerText * 1;
                        if (val) {
                            // arr.splice(val - 1, 1);
                            arr[val - 1] = undefined;

                        }

                    }

                }
                let temp = [...arr.filter(data => data != undefined)]
                if (temp.length == 1) {
                    find = true;
                    this.set(i, i1, temp[0]);
                } else if (temp.length == 0) {
                    this.newState();
                    return false;
                }
                dir[i + "_" + i1] = temp;
            }

        }
        if (Object.keys(dir).length == 0) {
            return true;
        }
        if (!find) {
            let small;
            let len = Infinity;
            for (const key in dir) {
                if (dir[key].length < len) {
                    len = dir[key].length;
                    small = key;
                }
            }
            // console.log(len, small, dir[small])
            this.setState(this.saveGrid(true), small, dir[small])
            this.newState();
        } else {}
    }
    unset(x, y) {
        if (!this.permanent[x][y]) {
            this.grid[x][y].elt.innerText = ""
            this.grid[x][y].style("background:#34495e")
        }
    }
    reset() {
        this.State = []
        for (let i = 0; i < 9; i++) {
            for (let i1 = 0; i1 < 9; i1++) {
                this.unset(i, i1)
            }
        }
    }
    setState(grid, key, dir) {
        key = key.split("_");
        for (const value of dir) {
            this.State.push([grid, key[0] * 1, key[1] * 1, value]);
        }
    }
    newState() {
        let state = this.State.pop();
        this.loadGrid(state[0]);
        this.set(state[1], state[2], state[3]);
    }
    solver() {
        let times = 0;
        console.time("end")
        while (!this.solve()) ++times;
        console.timeEnd("end")
        console.log(times)
        this.update();
    }

}