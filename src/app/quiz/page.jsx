import { currentUser } from "@clerk/nextjs/server";
import {db} from '@/utils/dbconnection'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Quiz(){

    async function handleSubmit(e) {
        "use server";

        const user = await currentUser();
        console.log(user);
        const email = user?.emailAddresses[0].emailAddress
        
        console.log(e);
        const formValues = {
            userName: e.get('userName'),
            energyUseage: e.get('energyUsage'),
            elecHeat: e.get('elecHeat'),
            oilHeat: e.get('oilHeat'),
            woodHeat: e.get('woodHeat'),
            gasHeat: e.get('gasHeat'),
            coalHeat: e.get('coalHeat'),
            busTravel: e.get('busTravel'),
            carTravel: e.get('carTravel'),
            trainTravel: e.get('trainTravel'),
            airTravel: e.get('airTravel'),
        }
        //console.log(formValues.busTravel);
        if(formValues.busTravel == ''){
            formValues.busTravel = null;
        }
        if(formValues.carTravel == ''){
            formValues.carTravel = null;
        }
        if(formValues.trainTravel == ''){
            formValues.trainTravel = null;
        }
        if(formValues.airTravel == ''){
            formValues.airTravel = null;
        }
        console.log(formValues);
        let gas = false;
        let coal = false;
        let wood = false;
        let elec = false;
        let oil = false;

        let numChecks = 0;
        if (formValues.gasHeat !== null) {
			gas = true;
            numChecks += 1;
		}
		if (formValues.coalHeat !== null) {
			coal = true;
            numChecks += 1;
		}
		if (formValues.woodHeat !== null) {
			wood = true;
            numChecks += 1;
		}
		if (formValues.elecHeat !== null) {
			elec = true;
            numChecks += 1;
		}
		if (formValues.oilHeat !== null) {
			oil = true;
            numChecks += 1;
		}
        
        const lowGas = 4*0.18259;
        const medGas = 8*0.18259;
        const highGas = 12*0.18259;
        const lowCoal = 4*0.31459;
        const medCoal = 8*0.31459;
        const highCoal = 12*0.31459;
        const lowWood = 4*0.165;
        const medWood = 8*0.165;
        const highWood = 12*0.165;
        const lowElec = 4*0.3369;
        const medElec = 8*0.3369;
        const highElec = 12*0.3369;
        const lowOil = 4*0.26709;
        const medOil = 8*0.26709;
        const highOil = 12*0.26709;

        const busFactor = 0.12525;
        const carFactor = 0.27368;
        const trainFactor = 0.1;
        const airFactor = 0.25;

        const busMiles = Number(formValues.busTravel);
		const carMiles = Number(formValues.carTravel);
		const trainMiles = Number(formValues.trainTravel);
		const airMiles = Number(formValues.airTravel);
        
        const travelCO2 = (busMiles * busFactor) + (carMiles * carFactor) + (trainMiles * trainFactor) + (airMiles * (airFactor / 365));

        let homeCO2 = 0;		
		if(formValues.energyUseage == 'l'){
			if(gas == true){ homeCO2 += lowGas/numChecks; }
			if(coal == true){ homeCO2 += lowCoal/numChecks; }
			if(wood == true){ homeCO2 += lowWood/numChecks; }
			if(elec == true){ homeCO2 += lowElec/numChecks; }
			if(oil == true){ homeCO2 += lowOil/numChecks; }
			homeCO2 += lowElec;
		} else if(formValues.energyUseage == 'm'){
			if(gas == true){ homeCO2 += medGas/numChecks; }
			if(coal == true){ homeCO2 += medCoal/numChecks; }
			if(wood == true){ homeCO2 += medWood/numChecks; }
			if(elec == true){ homeCO2 += medElec/numChecks; }
			if(oil == true){ homeCO2 += medOil/numChecks; }
			homeCO2 += lowElec;
		} else if(formValues.energyUseage == 'h'){
			if(gas == true){ homeCO2 += highGas/numChecks; }
			if(coal == true){ homeCO2 += highCoal/numChecks; }
			if(wood == true){ homeCO2 += highWood/numChecks; }
			if(elec == true){ homeCO2 += highElec/numChecks; }
			if(oil == true){ homeCO2 += highOil/numChecks; }
			homeCO2 += lowElec;
		} else{
			// return error
			console.error(`Error Message: error with form input.`);
		}
        const total = homeCO2 + travelCO2;	
		const totalCO2 = parseFloat(total.toFixed(2));

		console.log(totalCO2);

        db.query('INSERT INTO youco2 (co2, name, email) VALUES ($1, $2, $3)', [
            totalCO2,
            formValues.userName,
            email
        ]);
        
        revalidatePath('/profile');
        redirect('/profile');
    }

    return(
        <>
            <form action={handleSubmit} id="co2Form" aria-label="Personal CO2 emmissions form">
                <label htmlFor="userName">Name</label>          
                <input id="userName" type="text" name="userName" required aria-label="Name input"/>          
                <label htmlFor="energyUsage">Home Energy Usage</label>
                <select id="energyUsage" name='energyUsage'>
                <option value="l" aria-label="Low home energy user">Low</option>
                <option value="m" aria-label="Medium home energy user">Medium</option>
                <option value="h" aria-label="High home energy user">High</option>
                </select>

                <fieldset id="heatType">
                <legend>Heating</legend>
                <div id="heatField">
                    <input id="gasHeat" type="checkbox" name="gasHeat" value="gas" aria-label="Gas heating user"/>
                    <label htmlFor="gasHeat">Gas</label>
                    
                    
                    <input id="coalHeat" type="checkbox" name="coalHeat" value="coal" aria-label="Coal heating user"/>
                    <label htmlFor="coalHeat">Coal</label>
                    
                    
                    <input id="woodHeat" type="checkbox" name="woodHeat" value="wood" aria-label="Wood heating user"/>
                    <label htmlFor="woodHeat">Wood</label>
                    
                    
                    <input id="elecHeat" type="checkbox" name="elecHeat" value="elec" aria-label="Electric heating user"/>
                    <label htmlFor="elecHeat">Electricity</label>
                    
                    
                    <input id="oilHeat" type="checkbox" name="oilHeat" value="oil" aria-label="Oil heating user"/>
                    <label htmlFor="oilHeat">Oil</label>
                    
                </div>
                </fieldset>

                <fieldset id="travel">
                <legend>Travel</legend>
                
                    <label htmlFor="busTravel">Bus Travel<br/>(miles/day)</label>
                    <input id="busTravel" type="number" min="0" name="busTravel" aria-label="Bus travel input miles per day"/>
                
                
                    <label htmlFor="carTravel">Car Travel<br/>(miles/day)</label>
                    <input id="carTravel" type="number" min="0" name="carTravel" aria-label="Car travel input miles per day"/>
                
                
                    <label htmlFor="trainTravel">Train Travel<br/>(miles/day)</label>
                    <input id="trainTravel" type="number" min="0" name="trainTravel" aria-label="Train travel input miles per day"/>
                
                
                    <label htmlFor="airTravel">Air Travel<br/>(miles/year)</label>
                    <input id="airTravel" type="number" min="0" name="airTravel" aria-label="Air travel input miles per year"/>
                

                </fieldset>
                <button id="submit" aria-label="Submit">Submit</button>
            </form>
        </>
    );
}