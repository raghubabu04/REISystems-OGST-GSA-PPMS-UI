import React, {useContext, useEffect} from "react";
import { MdDelete } from "react-icons/md";
import { CommonApiService } from "../../../../api-kit/common/common-api.service";
import PPMSDatatable from "../../../../ui-kit/components/common/datatable/PPMS-datatable";
import { PPMSInput } from "../../../../ui-kit/components/common/input/PPMS-input";
import { PPMSButton } from "../../../../ui-kit/components/common/PPMS-button";
import { PPMSSelect } from "../../../../ui-kit/components/common/select/PPMS-select";
import { UserProfileSaleContext } from "../UserProfileForSalesContext";

interface UserProfileForSalesUserZoneProps {}

const ALL_ZONES = [1,2,3,4,5,6];
const ALL_REGIONS = [['1','2','3'],['4','5'],['6','7','8'],['10a','9'],[],['W']];

export default function UserProfileForSalesUserZone(props: UserProfileForSalesUserZoneProps) {

    const {salesProfileUserZoneState, updateSalesProfileUserZoneState} = useContext(UserProfileSaleContext);
    console.log("Added userZones list to",salesProfileUserZoneState.zoneList);
    const zoneColumns = [ 
        {
          Header: "Zone Name",
          accessor: "zoneName",
        },
        {
          Header: "Regions",
          accessor: "regions",
        }
      ];

    return (
        <React.Fragment>
          <div className="usa-accordion--bordered desktop:grid-col-12">
            <div className="short-table">
              <PPMSDatatable
                title={""}
                data={salesProfileUserZoneState.zoneList}
                columns={zoneColumns}
                defaultSortField={"zoneName"}
                isPaginationEnabled={false}
                loading={false}
                totalRows={salesProfileUserZoneState.zoneList.length}
                handleSort={() => {}}
              />
            </div> 
            <br/> 
             
          </div>
        </React.Fragment>
      ); 
}