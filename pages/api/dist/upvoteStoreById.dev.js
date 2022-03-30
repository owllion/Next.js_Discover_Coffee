"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _airtable = require("../../lib/airtable");

var upvoteStoreById = function upvoteStoreById(req, res) {
  var id, records, record, calc, updateRecord, minifiedRecord;
  return regeneratorRuntime.async(function upvoteStoreById$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(req.method === "PUT")) {
            _context.next = 25;
            break;
          }

          _context.prev = 1;
          id = req.body.id;

          if (!id) {
            _context.next = 19;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _airtable.findRecordByFilter)(id));

        case 6:
          records = _context.sent;

          if (!(records.length !== 0)) {
            _context.next = 16;
            break;
          }

          //有存在才能更新or回傳
          //records是陣列 商店資料就是唯一元素
          record = records[0]; //要每次+1就是直接賦直給變數就好

          calc = parseInt(record.voting) + 1; //update record
          //L161 記得要傳的id必須是recordId喔! 不是我們自己設定的id

          _context.next = 12;
          return regeneratorRuntime.awrap(_airtable.table.update([{
            id: record.recordId,
            fields: {
              voting: calc
            }
          }]));

        case 12:
          updateRecord = _context.sent;

          if (updateRecord) {
            minifiedRecord = (0, _airtable.getMinifiedRecords)(updateRecord);
            res.json(minifiedRecord);
          }

          _context.next = 17;
          break;

        case 16:
          res.json({
            message: "id does not exist!",
            id: id
          });

        case 17:
          _context.next = 20;
          break;

        case 19:
          res.status(400).json({
            message: "id is missing!"
          });

        case 20:
          _context.next = 25;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: "Error upvoting coffee store",
            error: _context.t0
          });

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 22]]);
};

var _default = upvoteStoreById;
exports["default"] = _default;