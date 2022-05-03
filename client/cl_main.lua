local creditCode = 1234

Citizen.CreateThread(function()
    while ESX == nil do
        Citizen.Wait(1);

        ESX = exports["btrp_base"]:getSharedObject()  
    end 

    if ESX.IsPlayerLoaded() then
        ESX.PlayerData = ESX.GetPlayerData()

		ESX.TriggerServerCallback("force_uttag:GetCreditcardCode", function(response2) 
			if response2 then
				creditCode = response2.creditCode
			end
		end)
    end
end)

RegisterNetEvent("esx:playerLoaded")
AddEventHandler("esx:playerLoaded", function(response)
	ESX.TriggerServerCallback("force_uttag:GetCreditcardCode", function(response2) 
		if response2 then
			creditCode = response2.creditCode
		end
	end)
end)

local atms = {
	-1126237515,
	506770882,
	-870868698,
	150237004,
	-239124254,
	-1364697528,  
}

Citizen.CreateThread(function()
	while true do
		local sleepThread = 850
		local player = PlayerPedId()
		local pCoords = GetEntityCoords(player)
		for i = 1, #Config.MarkerPositions do 
			local dst = #(pCoords - Config.MarkerPositions[i])

			if dst <= 10.0 then
				RequestModel(Config.PedModel) while not HasModelLoaded(Config.PedModel) do Wait(7) end
				if not DoesEntityExist(bussinessPed) then
					bussinessPed = CreatePed(4, Config.PedModel, Config.PedPos, false, true)
					FreezeEntityPosition(bussinessPed, true)
					SetBlockingOfNonTemporaryEvents(bussinessPed, true)
					SetEntityInvincible(bussinessPed, true)
				end
			end

			if dst >= 1.5 and dst <= 6.0 then
				sleepThread = 5
				Funcs.Text3D( Config.MarkerPositions[i], "Banken")
			end

			if dst <= 1.5 then
				sleepThread = 5
				Funcs.Text3D( Config.MarkerPositions[i], "[~p~E~s~] Banken")

				if IsControlJustPressed(1, 38) then
					ESX.TriggerServerCallback("force_uttag:GetPlayerInfo", function(response)
						ESX.TriggerServerCallback("force_uttag:GetCreditcardCode", function(response2)
							if response2 then
								-- print(response.firstname)
								print(creditCode)
								SendNUIMessage({
									action = "OpenMenu",
									data = {
										firstname = response.firstname,
										lastname = response.lastname,
										dob = response.id,
										cash = response.cash,
										money = response.takeOutSalary,
										moneyBank = response.bank,
										creditCode = response2.creditCode
									}
								})
							else
								print(creditCode)
								SendNUIMessage({
									action = "OpenMenu",
									data = {
										firstname = response.firstname,
										lastname = response.lastname,
										dob = response.id,
										cash = response.cash,
										money = response.takeOutSalary,
										moneyBank = response.bank,
										creditCode = "Du har ingen bankkod!"
									}
								})
							end
						end)
					end)
				end
			end
		end

		for atmIndex = 1, #atms do
			local atmHash = atms[atmIndex]

			local closestAtm = GetClosestObjectOfType(pCoords, 3.0, atmHash, false)

			if DoesEntityExist(closestAtm) then
				if cachedEntity ~= closestAtm then
					cachedEntity = closestAtm
					
					if DoesBlipExist(cachedBlip) then
						RemoveBlip(cachedBlip)
					end
	
					cachedBlip = AddBlipForCoord(GetEntityCoords(closestAtm))
	
					SetBlipSprite(cachedBlip, 500)
					SetBlipScale(cachedBlip, 0.3)
					SetBlipAsShortRange(cachedBlip, true)
					SetBlipColour(cachedBlip, 57)
					BeginTextCommandSetBlipName("STRING")
					AddTextComponentString("Bankomat")
					EndTextCommandSetBlipName(cachedBlip)
				end

				local dstCheck = GetDistanceBetweenCoords(pCoords, GetEntityCoords(closestAtm), true)
	
				if dstCheck <= 2.5 then
					sleepThread = 5
	
					local displayPos = GetOffsetFromEntityInWorldCoords(closestAtm, 0.0, 0.0, 1.0)
	
					if IsControlJustPressed(0, 38) then
						if not IsPedInAnyVehicle(ped) then
							if creditCode ~= 1234 then
								ESX.TriggerServerCallback("force_uttag:GetPlayerInfo", function(response)
									SendNUIMessage({
										action = "OpenAtm",
										data = {
											creditCode = creditCode,
											cash = response.cash,
											moneyBank = response.bank
										}
									})
								end)
							else
								ESX.ShowNotification("Du har inget bankkort, vänligen gå till banken.")
							end
						else
							ESX.ShowNotification("Du måste vara till fots.")
						end
					end
					
					-- ESX.Game.Utils.DrawText3D(displayPos, "[~y~E~s~] Bankomat")
					Funcs.Text3D(displayPos, "[~y~E~s~] Bankomat")
				end
			end
		end

		Wait(sleepThread)
	end
end)

RegisterNetEvent("force_uttag:CreditCode")
AddEventHandler("force_uttag:CreditCode", function(newCode)

	creditCode = newCode
	print(creditCode)

	SendNUIMessage({
		action = "UpdateCreditcode",
		data = creditCode
	})
end)

GetCode = function()
	return creditCode
end

RegisterNetEvent("force_uttag:OpenMenu")
AddEventHandler("force_uttag:OpenMenu", function()
	ESX.UI.Menu.CloseAll()

	ESX.TriggerServerCallback("force_uttag:GetPlayerInfo", function(response)
		if response then

			ESX.UI.Menu.Open('default', GetCurrentResourceName(), 'weamenu',
			{
				title = 'Ditt lönekontos saldo: ' .. response.takeOutSalary .. "SEK",
				align = 'center',
				elements = {

				}
			},

			function(data, menu)
				
			end,
			function(data, menu)
				menu.close()
			end)
		end
	end)
end)