const Ps = require("../models/psSchema");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
router.route("/ps");

router.put("/ps/y", async (req, res) => {
  var date = req.body.date;
  var tp = req.body.tp;
  var name = req.body.name;
  var num = req.body.num;
  var color = req.body.color;
  var admin = req.body.admin;
  await Ps.findOne({ num: num })
    .then(async (asset) => {
      let assetResv = asset.Reservations;
      if (!assetResv[date]) {
        await Ps.updateOne(
          { num: num },
          {
            $set: {
              Reservations: {
                ...assetResv,
                [date]: {
                  [color]: tp,
                  Resvs: [{ name: name, tp: tp, color: color, index: 1 }],
                },
              },
            },
          }
        )
          .then(res.send({ sts: "ok" }))
          .catch((err) => {
            res.send({ sts: "fail", err: err });
          });
      } else {
        if (admin !== 1) {
          tp.map((i) => {
            if (
              assetResv[date].yellow?.includes(i) ||
              assetResv[date].red?.includes(i)
            ) {
              throw new Error("tp");
            }
          });
        }
        var yellowtp = [];
        var redtp = [];
        var allResvs = assetResv[date].Resvs;
        var match = allResvs.filter((x) => {
          return x.tp.toString() == tp.toString();
        });
        if (match.length > 0) {
          if (assetResv[date][color]) {
            yellowtp = [
              ...assetResv[date][color].filter((i) => {
                return !tp.includes(i);
              }),
            ];
          }
          tp.forEach((element) => {
            yellowtp = [...yellowtp, element];
          });
          if (assetResv[date].red) {
            redtp = [
              ...assetResv[date].red.filter((i) => {
                return !tp.includes(i);
              }),
            ];
          }
          //sort by index then choose arr[index]
          var filtered = allResvs.filter((i) => {
            return i.tp.toString() !== tp.toString();
          });
          var changed = {
            name: name,
            tp: tp,
            color: color,
            index: match[0].index,
          };
          console.log(changed);
          await Ps.updateOne(
            { num: num },
            {
              $set: {
                Reservations: {
                  ...assetResv,
                  [date]: {
                    red: redtp,
                    yellow: yellowtp,
                    Resvs: [...filtered, changed],
                  },
                },
              },
            }
          )
            .then(res.send({ sts: "ok" }))
            .catch((err) => {
              res.send({ sts: "fail", err: err });
            });
        } else {
          if (assetResv[date][color]) {
            yellowtp = [...assetResv[date][color]];
          }
          tp.forEach((element) => {
            yellowtp = [...yellowtp, element];
          });
          if (assetResv[date].red) {
            redtp = [
              ...assetResv[date].red.filter((i) => {
                return !tp.includes(i);
              }),
            ];
          }
          var newResv = {
            name: name,
            tp: tp,
            color: color,
            index: allResvs.length + 1,
          };
          await Ps.updateOne(
            { num: num },
            {
              $set: {
                Reservations: {
                  ...assetResv,
                  [date]: {
                    red: redtp,
                    yellow: yellowtp,
                    Resvs: [...allResvs, newResv],
                  },
                },
              },
            }
          )
            .then(res.send({ sts: "ok" }))
            .catch((err) => {
              res.send({ sts: "fail", err: err });
            });
        }
      }
    })
    .catch((err) => {
      res.send({ sts: "fail", err: err.message });
    });
});
router.put("/ps/r", async (req, res) => {
  var date = req.body.date;
  var tp = req.body.tp;
  var name = req.body.name;
  var num = req.body.num;
  var color = req.body.color;
  var admin = req.body.admin;
  await Ps.findOne({ num: num })
    .then(async (asset) => {
      let assetResv = asset.Reservations;
      if (!assetResv[date]) {
        await Ps.updateOne(
          { num: num },
          {
            $set: {
              Reservations: {
                ...assetResv,
                [date]: {
                  [color]: tp,
                  Resvs: [{ name: name, tp: tp, color: color, index: 1 }],
                },
              },
            },
          }
        )
          .then(res.send({ sts: "ok" }))
          .catch((err) => {
            res.send({ sts: "fail", err: err });
          });
      } else {
        if (admin !== 1) {
          tp.map((i) => {
            if (
              assetResv[date].yellow?.includes(i) ||
              assetResv[date].red?.includes(i)
            ) {
              throw new Error("tp");
            }
          });
        }
        var yellowtp = [];
        var redtp = [];
        var allResvs = assetResv[date].Resvs;
        var match = allResvs.filter((x) => {
          return x.tp.toString() == tp.toString();
        });
        if (match.length > 0) {
          if (assetResv[date][color]) {
            redtp = [
              ...assetResv[date][color].filter((i) => {
                return !tp.includes(i);
              }),
            ];
          }
          tp.forEach((element) => {
            redtp = [...redtp, element];
          });
          if (assetResv[date].yellow) {
            yellowtp = [
              ...assetResv[date].yellow.filter((i) => {
                return !tp.includes(i);
              }),
            ];
          }
          //sort by index then choose arr[index]
          var filtered = allResvs.filter((i) => {
            return i.tp.toString() !== tp.toString();
          });
          var changed = {
            name: name,
            tp: tp,
            color: color,
            index: match[0].index,
          };
          console.log(filtered);
          console.log(changed);
          await Ps.updateOne(
            { num: num },
            {
              $set: {
                Reservations: {
                  ...assetResv,
                  [date]: {
                    red: redtp,
                    yellow: yellowtp,
                    Resvs: [...filtered, changed],
                  },
                },
              },
            }
          )
            .then(res.send({ sts: "ok" }))
            .catch((err) => {
              res.send({ sts: "fail", err: err });
            });
        } else {
          if (assetResv[date][color]) {
            redtp = [...assetResv[date][color]];
          }
          tp.forEach((element) => {
            redtp = [...redtp, element];
          });
          if (assetResv[date].yellow) {
            yellowtp = [
              ...assetResv[date].yellow.filter((i) => {
                return !tp.includes(i);
              }),
            ];
          }
          var newResv = {
            name: name,
            tp: tp,
            color: color,
            index: allResvs.length + 1,
          };
          await Ps.updateOne(
            { num: num },
            {
              $set: {
                Reservations: {
                  ...assetResv,
                  [date]: {
                    red: redtp,
                    yellow: yellowtp,
                    Resvs: [...allResvs, newResv],
                  },
                },
              },
            }
          )
            .then(res.send({ sts: "ok" }))
            .catch((err) => {
              res.send({ sts: "fail", err: err });
            });
        }
      }
    })
    .catch((err) => {
      res.send({ sts: "fail", err: err.message });
    });
});

router.put("/ps/g", async (req, res) => {
  var date = req.body.date;
  var tp = req.body.tp;
  var name = req.body.name;
  var num = req.body.num;
  var admin = req.body.admin;

  await Ps.findOne({ num: num })
    .then(async (asset) => {
      let assetResv = asset.Reservations;
      var unfilteredResvs = assetResv[date].Resvs;
      var allResvs = unfilteredResvs?.filter((i) => {
        return i.tp.toString() !== tp.toString();
      });
      if (allResvs.length == 0 || !allResvs) {
        await Ps.updateOne(
          { num: num },
          {
            $set: {
              Reservations: {
                ...assetResv,
                [date]: { red: [], yellow: [], Resvs: [] },
              },
            },
          }
        )
          .then(res.send({ sts: "ok" }))
          .catch((err) => {
            res.send({ sts: "fail", err: err });
          });
        return;
      } else {
        if (admin !== 1) {
          tp.map((i) => {
            if (
              assetResv[date].yellow?.includes(i) ||
              assetResv[date].red?.includes(i)
            ) {
              throw new Error("tp");
            }
          });
        }
        var yellowtp = [];
        var redtp = [];
        if (assetResv[date].yellow) {
          yellowtp = assetResv[date].yellow.filter((i) => {
            return !tp.includes(i);
          });
        }
        if (assetResv[date].red) {
          redtp = assetResv[date].red.filter((i) => {
            return !tp.includes(i);
          });
        }
        await Ps.updateOne(
          { num: num },
          {
            $set: {
              Reservations: {
                ...assetResv,
                [date]: { red: redtp, yellow: yellowtp, Resvs: allResvs },
              },
            },
          }
        )
          .then(res.send({ sts: "ok" }))
          .catch((err) => {
            res.send({ sts: "fail", err: err });
          });
      }
    })
    .catch((err) => {
      res.send({ sts: "fail", err: err.message });
    });
});

router.get("/ps/:id", async (req, res) => {
  await Ps.findOne({ num: req.params.id })
    .catch((err) => {
      res.send({ sts: "fail", err: err.message });
    })
    .then((object) => {
      res.send({ sts: "ok", object: object });
    });
});

module.exports = router;
