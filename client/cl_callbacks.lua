RegisterNUICallback("force_uttag:SetNUIFocus", function(state)
    SetNuiFocus(state, state)
end)

RegisterNUICallback("force_uttag:TakeOutMoney", function(value)
    TriggerServerEvent("force_uttag:WithdrawMoney", value)
end)

RegisterNUICallback("force_uttag:WithdrawMoney", function(value2)
    TriggerServerEvent("force_uttag:WithdrawBankMoney", value2)
end)

RegisterNUICallback("force_uttag:DepositMoney", function(value2)
    TriggerServerEvent("force_uttag:DepositBankMoney", value2)
end)

RegisterNUICallback("force_uttag:GiveBankCard", function()
    TriggerServerEvent("force_uttag:GiveBankcard")
end)