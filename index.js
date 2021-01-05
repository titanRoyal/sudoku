let express = require("express")

let fetch = require("node-fetch")

let app = express()


let port = process.env.PORT || 3000
let backup = [
    "7P2P04P008P00", "000000007P", "003P02P01P00",
    "9P00001P000", "00004P5P003P", "06P07P0004P0",
    "005P8P02P000", "0000003P04P", "8P07P000000"
];
app.use("/game", express.static("game"))
app.get("/", async (req, res) => {

    try {

        let r = await fetch("https://online-sudoku.p.rapidapi.com/random", {
            headers: {
                "x-rapidapi-key": "a7617c5662msh1a97c78f5639131p1de291jsnb945ff5a58b8",
                "x-rapidapi-host": "online-sudoku.p.rapidapi.com",
                "useQueryString": true
            }
        })
        let resu = await r.json();
        resu.items = (() => {
            let arr = [];
            for (let i = 0; i < 9; i++) {
                arr.push(resu.item.substr(i * 9, 9))
            };
            return arr;
        })()
        let rr = processing(resu.items);
        res.cookie("grid", rr);
    } catch (error) {
        res.cookie("grid", backup.join("_"));
    }
    res.redirect("/game")
});
app.listen(port, () => console.log("http://localhost:" + port));


function processing(input) {
    input = input.map(data => data.split(""))
    let solids = Math.floor(Math.random() * 15) + 5;
    let out = {}
    while (solids > 0) {
        let x = Math.floor(Math.random() * 9)
        let y = Math.floor(Math.random() * 9)
        if (!out[x + "_" + y]) {
            --solids;
            out[x + "_" + y] = true;
        }
    }
    input.forEach((row, x) => {
        row.forEach((data, y) => {
            if (!out[x + "_" + y]) {
                input[x][y] = 0;
            } else {
                input[x][y] = data + "P"
            }
        })
    })
    input.forEach((d, i) => {
        input[i] = d.join("")
    })
    return input.join("_")
}