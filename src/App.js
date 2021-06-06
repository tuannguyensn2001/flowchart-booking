import React from 'react';
import Main from "./features/wfDefDetail/Main";
import 'antd/dist/antd.css';
import {BrowserRouter,Route,Switch} from "react-router-dom";
import wfProcess from './features/wfProcess/index'
import wfThread from './features/wfThread/index';
import Popper from "./features/poppers";
import {QueryClient,QueryClientProvider} from "react-query";


const queryClient = new QueryClient();

function App()
{
  return(
      <QueryClientProvider client={queryClient}>
          <BrowserRouter>
              {/* eslint-disable-next-line react/jsx-no-undef */}
              <Switch>
                  <Route exact path={'/wf-defs/:id'} component={Main}/>
                  <Route exact path={'/wf-processes/:id'} component={wfProcess} />
                  <Route path={'/job-details/:id'} component={wfThread} />
                  <Route path={'/popper'} component={Popper} />
              </Switch>
          </BrowserRouter>
      </QueryClientProvider>
  )
}

export default App;