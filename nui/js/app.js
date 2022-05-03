let firstname = "";
let lastname  = "";
let id        = "";
let money     = "";
let moneyBank = "";
let cash = "";
let creditCode = "";

$(document).ready(function() {
    window.addEventListener("message", function(event) {
        let data = event.data
        let action = data.action

        // BANKS

        if (action == "OpenMenu") {
            firstname = data.data.firstname
            lastname = data.data.lastname
            id = data.data.id
            money = data.data.money
            moneyBank = data.data.moneyBank
            cash = data.data.cash
            creditCode = data.data.creditCode

            OpenMenu()
        }

        if (action == "UpdateCreditcode") {
            creditCode = data.data
            $(`.creditCode`).html(`
                <div>Bankkod: <span style="font-weight: bold">${creditCode}</span></div>
            `);
        }

        // ATMS

        if (action == "OpenAtm") {
            creditCode = data.data.creditCode
            moneyBank = data.data.moneyBank
            cash = data.data.cash

            OpenAtms()
        }

    })

    $(document).keydown(function(key) {
        if (key.keyCode == 27) {
            CloseMenu()
        }
    })

    var input = document.getElementById("amount");

    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            TakeOutMoney()
        }
    });
})

;(function($){
    $.fn.keypad = function(confirmPin, options){
      var globalSettings = $.extend({}, $.fn.keypad.defaults, options);
          var keypads = $();
          this.each(function()
          {
              let $element = $(this),
            $backspace,
            $enteredNumbers,
            $numbers,
            $confirm,
            STATE = {mouseDownTime: 0, enteredPin: '' },
            backSpaceInterval = null,
            addToEnteredNumbers,
            backspaceOnPin,
            clearPin,
            settings = $.extend({}, globalSettings, $element.data('keypad-options'));
        
        addToEnteredNumbers = function(e){
          var num = $('<div class="num">'),
              numVal = isNaN(e) ? $(this).data("num") : e;
          num.text(numVal);
          $enteredNumbers.append(num);
          STATE.enteredPin += numVal;
          setTimeout(() => num.addClass('hidden'), 500);
        }
        
        backspaceOnPin = function(e){
          const $toBeRemoved = $enteredNumbers.children().last();
          $toBeRemoved.addClass('erased');
          setTimeout(() => {
            $toBeRemoved.remove();
            if (STATE.enteredPin.length >= 1) STATE.enteredPin = STATE.enteredPin.slice(0, -1);
          }, 100);
        }
        
        clearPin = function(e){
          $enteredNumbers.empty();
          STATE.enteredPin = '';
        }
        
        $element.addClass("keypad").attr("tabindex", 0);
        $element.append(`<div class="keypad-input-field">
      <div class="entered-numbers-wrapper">
        <div class="entered-numbers"></div>
      </div>
      <div class="backspace">
        <div class="hover-dot backspace-icon"><i class="fa fa-times"></i></div>
      </div>
    </div>
    <div class="keypad-numbers"></div>
        `);
        
        $element.on('focus', function(){
          $element.addClass("focus");
        });
        $element.on('blur', function(){
          $element.removeClass("focus");
        });
        
        $backspace = $element.find(".backspace")
          .on("mousedown", function() {
        //   STATE.mouseDownTime = moment().valueOf();
        //   backSpaceInterval = setInterval(() => {
        //     const timeDiff = moment().valueOf() - STATE.mouseDownTime;
        //     if (timeDiff >= 1000) clearPin();
        //   }, 100);
            backspaceOnPin();
        })
          .on("mouseup", function() {
          const timeDiff = moment().valueOf() - STATE.mouseDownTime;
          clearInterval(backSpaceInterval);
          if (timeDiff < 1000) {
            backspaceOnPin();
          }
        })
          .on("mouseleave", function() {
          clearInterval(backSpaceInterval);
        });
        
        $enteredNumbers = $element.find(".entered-numbers");
        $numbers = $element.find(".keypad-numbers");
        
        $.each(settings.keys, function(index, item){
          var $key = $(`<div class="item-wrapper hover-dot">
        <div class="item">
          <h1>${item.num}</h1>
          <h2>${item.alpha}</h2>
        </div>
      </div>`)
          if(item.num == 0){
            $key.addClass("zero")
          }
          $key.data("num", item.num)
          $key.on('click', addToEnteredNumbers);
          $numbers.append($key);
        })
        
        $confirm = $(`<div class="item-wrapper hover-dot" class="confirm">
        <div class="item">OK</div>
      </div>`);
        $confirm.on('click', function(){
        //   confirmPin(STATE.enteredPin);
            OpenBanks(STATE.enteredPin);
        });
        $numbers.append($confirm);
        
        // Interface
              $element.data('keypad', {
                  addToEnteredNumbers:	addToEnteredNumbers,
          backspaceOnPin: backspaceOnPin,
                  clearPin:	clearPin
              });
        $(window).on('keydown', function(e){
          if ($element.hasClass('focus'))
          {
            if (e.keyCode >= 48 && e.keyCode <= 57) {
              let num = (e.keyCode - 48).toString();
              addToEnteredNumbers(num);
            } else
            {
              switch (e.keyCode) {
                case 8:
                  backspaceOnPin();
                  break;
                case 13:
                //   confirmPin(STATE.enteredPin);
                    OpenBanks(STATE.enteredPin);
                  break;
                default:
                  break;
              }
            }
          }
        });
       
              keypads = keypads.add($element); 
          });
          return keypads;
      };
    
    $.fn.getKeypad = function(){
          return this.closest('.keypad');
      };
    
    $.fn.clear = function(){
          this.each(function()
          {
              var keypad = $(this).getKeypad(),
                  data = (keypad.length > 0) ? keypad.data('keypad') : false;
              // If valid
              if (data)
              {
                  data.clearPin();
              }
          });
          return this;
      };
    
    $.fn.addNumber = function(value){
          this.each(function()
          {
              var keypad = $(this).getKeypad(),
                  data = (keypad.length > 0) ? keypad.data('keypad') : false;
              // If valid
              if (data)
              {
                  data.addToEnteredNumbers(value);
              }
          });
          return this;
      };
    
    $.fn.keypad.defaults = {
      keys: [
        {num: 1, alpha: ""},
        {num: 2, alpha: "ABC"},
        {num: 3, alpha: "DEF"},
        {num: 4, alpha: "GHI"},
        {num: 5, alpha: "JKL"},
        {num: 6, alpha: "MNO"},
        {num: 7, alpha: "PQRS"},
        {num: 8, alpha: "TUV"},
        {num: 9, alpha: "WXYZ"},
        {num: 0, alpha: "+"},
      ]
    };
    
})(jQuery);

var key = $(".keypad").keypad(function(pin){
    alert(pin)
});

function OpenMenu() {
    $(".swedbankContainer").show(250)
    $.post(`https://force_uttag/force_uttag:SetNUIFocus`, JSON.stringify(true))
}

function OpenContainerMenu() {
    $(`.welcomeMessage`).html(`
        <div>Välkommen <span style="font-weight: bold">${firstname}</span>!</div>
    `);

    $(`.accountInfo`).html(`
        <div>Ditt nuvarande löne saldo: <span style="font-weight: bold">${money}</span>SEK</div>
    `);

    $(".container").show()
    $(".swedbankContainer").hide()
    $(".bankContainer").hide()
}

function GoBackToMain() {
    $(".container").hide()
    $(".bankContainer").hide()
    $(".swedbankContainer").show()
}

function OpenSalaryMenu() {
    $("input").val("")
    OpenContainerMenu()
}

function TakeOutMoney() {
    const value = $("#amount").val()

    if (value == "") {
        return M.toast({html : `Skriv in en summa.`})
    }
    if (money >= value) {

        money = money - value
        moneyBank = moneyBank + parseInt(value)

        $(`.accountInfo`).html(`
            <div>Ditt nuvarande löne saldo: <span style="font-weight: bold">${money}</span>SEK</div>
        `);

        $.post(`https://force_uttag/force_uttag:TakeOutMoney`, JSON.stringify(value))
        M.toast({html : `Du tog ut ${value}SEK.`})
    } else {
        M.toast({html : "Åtgärd omöjlig."})
    }
}

function OpenBankMenu() {
    $("input").val("")
    $(`.welcomeMessage`).html(`
        <div>Välkommen <span style="font-weight: bold">${firstname}</span>!</div>
    `);

    $(`.accountInfo`).html(`
        <div>Ditt nuvarande kontant saldo: <span style="font-weight: bold">${cash}</span>SEK</div>
        <div>Ditt nuvarande bank saldo: <span style="font-weight: bold">${moneyBank}</span>SEK</div>
    `);

    $(`.creditCode`).html(`
        <div>Bankkod: <span style="font-weight: bold">${creditCode}</span></div>
    `);

    $(".container").hide()
    $(".swedbankContainer").hide()
    $(".bankContainer").show()
}

function WithdrawMoney() {
    const value2 = $("#amount2").val()

    if (value2 == "") {
        return M.toast({html : `Skriv in en summa.`})
    }
    if (moneyBank >= value2) {

        moneyBank = moneyBank - value2
        cash = cash + parseInt(value2)

        $(`.accountInfo`).html(`
            <div>Ditt nuvarande kontant saldo: <span style="font-weight: bold">${cash}</span>SEK</div>
            <div>Ditt nuvarande bank saldo: <span style="font-weight: bold">${moneyBank}</span>SEK</div>
        `);

        $.post(`https://force_uttag/force_uttag:WithdrawMoney`, JSON.stringify(value2))
        M.toast({html : `Du tog ut ${value2}SEK.`})
    } else {
        M.toast({html : "Åtgärd omöjlig."})
    }
}

function DepositMoney() {
    const value2 = $("#amount2").val()

    if (value2 == "") {
        return M.toast({html : `Skriv in en summa.`})
    }
    if (cash >= value2) {

        moneyBank = moneyBank + parseInt(value2)
        cash = cash - parseInt(value2)

        $(`.accountInfo`).html(`
            <div>Ditt nuvarande kontant saldo: <span style="font-weight: bold">${cash}</span>SEK</div>
            <div>Ditt nuvarande bank saldo: <span style="font-weight: bold">${moneyBank}</span>SEK</div>
        `);

        $.post(`https://force_uttag/force_uttag:DepositMoney`, JSON.stringify(value2))
        M.toast({html : `Du satte in ${value2}SEK.`})
    } else {
        M.toast({html : "Åtgärd omöjlig."})
    }
}

function GiveBankCard() {
    if (creditCode == "Du har ingen bankkod!") {
        $.post(`https://force_uttag/force_uttag:GiveBankCard`)
        M.toast({html : "Du tog ut en bankkod."})
    } else {
        M.toast({html : "Du har redan en bankkod."})
    }
}

function OpenAtms() {
    $(".AtmContainer").show(250);
    $.post(`https://force_uttag/force_uttag:SetNUIFocus`, JSON.stringify(true))
}

function OpenBanks(enteredPin) {
    if (enteredPin == creditCode) {
        $(".AtmContainer").hide(250)
        $(".AtmBank").show(250)

        $(`.moneyCon`).html(`
            <div>Kontant: <span style="font-weight: bold">${cash}</span>SEK</div>
            <div>Bank: <span style="font-weight: bold">${moneyBank}</span>SEK</div>
        `);
    } else {
        M.toast({html : "Du har skrivit in fel pin kod."})
    }
}

function GoBackToMainAtm() {
    $(".AtmBank").show()
}

function atmWithdraw() {
    moneyValW = $("#atmWithdraw").val()
    console.log(moneyValW)

    if (moneyValW == "") {
        return M.toast({html : `Skriv in en summa.`})
    }
    if (moneyBank >= moneyValW) {

        moneyBank = moneyBank - moneyValW
        cash = cash + parseInt(moneyValW)

        $(`.moneyCon`).html(`
            <div>Kontant: <span style="font-weight: bold">${cash}</span>SEK</div>
            <div>Bank: <span style="font-weight: bold">${moneyBank}</span>SEK</div>
        `);

        $.post(`https://force_uttag/force_uttag:WithdrawMoney`, JSON.stringify(moneyValW))
        M.toast({html : `Du tog ut ${moneyValW}SEK.`})
    } else {
        M.toast({html : "Åtgärd omöjlig."})
    }
}

function atmDeposit() {
    moneyValD = $("#atmDeposit").val()
    console.log(moneyValD)

    if (moneyValD == "") {
        return M.toast({html : `Skriv in en summa.`})
    }
    if (cash >= moneyValD) {

        moneyBank = moneyBank + parseInt(moneyValD)
        cash = cash - parseInt(moneyValD)

        $(`.moneyCon`).html(`
            <div>Kontant: <span style="font-weight: bold">${cash}</span>SEK</div>
            <div>Bank: <span style="font-weight: bold">${moneyBank}</span>SEK</div>
        `);

        $.post(`https://force_uttag/force_uttag:DepositMoney`, JSON.stringify(moneyValD))
        M.toast({html : `Du satte in ${moneyValD}SEK.`})
    } else {
        M.toast({html : "Åtgärd omöjlig."})
    }
}


function CloseMenu() {
    M.Toast.dismissAll();
    $("input").val("")

    $(".container").hide(250)
    $(".swedbankContainer").hide(250)
    $(".bankContainer").hide(250)
    $(".AtmContainer").hide(250)
    $(".AtmBank").hide(250)
    $.post(`https://force_uttag/force_uttag:SetNUIFocus`, JSON.stringify(false))
}