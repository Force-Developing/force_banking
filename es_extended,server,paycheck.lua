ESX.StartPayCheck = function()

	function payCheck()
  
        local xPlayers = ESX.GetPlayers()
        local existingMoney
  
	    for i=1, #xPlayers, 1 do
  
            local xPlayer = ESX.GetPlayerFromId(xPlayers[i])
            local job     = xPlayer.job.grade_name
            local salary  = xPlayer.job.grade_salary
  
            if xPlayer.job.grade_salary > 0 then
                -- xPlayer.addAccountMoney("bank", salary)

                MySQL.Async.fetchAll('SELECT * FROM `characters` WHERE `id` = @id', {
                    ['@id']   = xPlayer.characterId,
                    ['@takeOutSalary'] = takeOutSalary
                }, function(response)

                    MySQL.Async.execute("UPDATE `characters` SET `takeOutSalary` = @takeOutSalary WHERE id = @id",
                    {
                        ['@id']   = xPlayer.characterId,
                        ['@takeOutSalary'] = response[1].takeOutSalary + salary
                    })

                    TriggerClientEvent('esx:showNotification', xPlayer.source, 'Du tog emot din lön på <span style="color:green">' .. salary .. ' SEK</span>, pengarna överfördes till ditt lönekonto.', "Lön", 5000)

                end)
        
                if xPlayer.job.grade_name == 'interim' then
                    TriggerClientEvent('esx:showNotification', xPlayer.source, 'Du tog emot din lön på <span style="color:green">' .. salary .. ' SEK</span>, pengarna överfördes till din bank.', "Lön", 5000)
                else
                    TriggerClientEvent('esx:showNotification', xPlayer.source,'Du tog emot din lön på <span style="color:green">' .. salary .. ' SEK</span>, pengarna överfördes till din bank.', "Lön", 5000)
                end
            end
  
	    end
  
	    SetTimeout(Config.PaycheckInterval, payCheck)
  
	end
  
	SetTimeout(Config.PaycheckInterval, payCheck)
  
end
  