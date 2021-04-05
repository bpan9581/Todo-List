import React, { useState } 			from 'react';
import Homescreen 		from './components/homescreen/Homescreen';
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { set } from 'mongoose';
 
const App = () => {
	let user = null;
    let transactionStack = new jsTPS();
	
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }
	const test = transactionStack.hasTransactionToUndo();
	const test2 = transactionStack.hasTransactionToRedo();
	const [hasUndo, setUndo] = useState(test);
	const [hasRedo, setRedo] = useState(test2);
	const updateUndo = () => {
		setUndo(transactionStack.hasTransactionToUndo());
	}
	const updateRedo = () => {
		setRedo(transactionStack.hasTransactionToRedo());
	}

	return(
		<BrowserRouter>
			<Switch>
				<Redirect exact from="/" to={ {pathname: "/home"} } />
				<Route 
					path="/home" 
					name="home" 
					render={() => 
						<Homescreen tps={transactionStack} fetchUser={refetch} user={user} hasUndo = {hasUndo}
						setUndo = {updateUndo}/>
					} 
				/>
				<Route/>
			</Switch>
		</BrowserRouter>
	);
}

export default App;