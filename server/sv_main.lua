ESX = nil 

TriggerEvent('esx:getSharedObject', function(obj) ESX = obj  
end)  

ESX.RegisterServerCallback("force_uttag:GetPlayerInfo", function(source, cb)
    local player = ESX.GetPlayerFromId(source)
    MySQL.Async.fetchAll('SELECT * FROM `characters` WHERE `id` = @id', {
        ['@id']   = player.characterId,
        ['@firstname'] = firstname,
        ['@lastname'] = lastname,
        ['@bank'] = bank,
        ['@takeOutSalary'] = takeOutSalary
    }, function(response)
        cb(response[1])
    end)
end)

RegisterServerEvent("force_uttag:WithdrawMoney")
AddEventHandler("force_uttag:WithdrawMoney", function(value)
    local player = ESX.GetPlayerFromId(source)

    MySQL.Async.fetchAll('SELECT * FROM `characters` WHERE `id` = @id', {
        ['@id']   = player.characterId,
        ['@takeOutSalary'] = takeOutSalary
    }, function(response)
        if response[1].takeOutSalary >= tonumber(value) then
            -- TriggerClientEvent('esx:showNotification', player.source, 'Du tog ut ~g~' .. value .. "SEK~s~ från ditt lönekonto!")
            player.addAccountMoney("bank", tonumber(value))

            MySQL.Async.execute("UPDATE `characters` SET `takeOutSalary` = @takeOutSalary WHERE id = @id",
            {
                ['@id']   = player.characterId,
                ['@takeOutSalary'] = response[1].takeOutSalary - tonumber(value)
            })

            MySQL.Async.execute("UPDATE `characters` SET `bank` = @bank WHERE id = @id",
            {
                ['@id']   = player.characterId,
                ['@bank'] = response[1].bank + tonumber(value)
            })
        else
            -- TriggerClientEvent("esx:showNotification", player.source, "Knasboll du har inte så mycket pengar på ditt löne konto :(")
        end
    end)
end)

RegisterServerEvent("force_uttag:WithdrawBankMoney")
AddEventHandler("force_uttag:WithdrawBankMoney", function(value2)
    local player = ESX.GetPlayerFromId(source)

    if player.getAccount('bank').money >= tonumber(value2) then
    -- if player.getMoney() >= tonumber(value2) then
        player.removeAccountMoney('bank', tonumber(value2))
        player.addMoney(tonumber(value2))

        MySQL.Async.fetchAll('SELECT * FROM `characters` WHERE `id` = @id', {
            ['@id']   = player.characterId,
            ['@takeOutSalary'] = takeOutSalary
        }, function(response)
            MySQL.Async.execute("UPDATE `characters` SET `bank` = @bank WHERE id = @id",
            {
                ['@id']   = player.characterId,
                ['@bank'] = response[1].bank - tonumber(value2)
            })
            MySQL.Async.execute("UPDATE `characters` SET `cash` = @cash WHERE id = @id",
            {
                ['@id']   = player.characterId,
                ['@cash'] = response[1].cash + tonumber(value2)
            })
        end)
    else

    end
end)

RegisterNetEvent("force_uttag:DepositBankMoney")
AddEventHandler("force_uttag:DepositBankMoney", function(value2)
    local player = ESX.GetPlayerFromId(source)

    if player.getMoney() >= tonumber(value2) then
        player.addAccountMoney('bank', tonumber(value2))
        player.removeMoney(tonumber(value2))

        MySQL.Async.fetchAll('SELECT * FROM `characters` WHERE `id` = @id', {
            ['@id']   = player.characterId,
            ['@takeOutSalary'] = takeOutSalary
        }, function(response)
            MySQL.Async.execute("UPDATE `characters` SET `bank` = @bank WHERE id = @id",
            {
                ['@id']   = player.characterId,
                ['@bank'] = response[1].bank + tonumber(value2)
            })
            MySQL.Async.execute("UPDATE `characters` SET `cash` = @cash WHERE id = @id",
            {
                ['@id']   = player.characterId,
                ['@cash'] = response[1].cash - tonumber(value2)
            })
        end)
    else

    end
end)

ESX.RegisterServerCallback("force_uttag:GetCreditcardCode", function(source, cb)
    local player = ESX.GetPlayerFromId(source)
    MySQL.Async.fetchAll('SELECT * FROM `characters_creditcards` WHERE `cid` = @cid', {
        ['@cid']   = player.characterId,
        ['@creditCode'] = creditCode
    }, function(response)
        if response[1] then
            cb(response[1])
        else
            cb(false)
        end
    end)
end)

RegisterServerEvent("force_uttag:GiveBankcard", function()
    local player = ESX.GetPlayerFromId(source)
    local newCode = math.random(1000, 9999)

    MySQL.Async.execute("INSERT INTO `characters_creditcards` (cid, creditCode) VALUES (@cid, @creditCode)",
    {
        ['@cid']   = player.characterId,
        ['@creditCode'] = newCode
    })

    TriggerClientEvent("force_uttag:CreditCode", source, newCode)
end)