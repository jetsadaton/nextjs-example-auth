import { Grid } from "@mui/material"

import UserListTable from "./list/UserListTable"
import type { UsersType } from "@/types/userTypes"


export default function Page() {
  const userData: UsersType[] = []

  return (
    <>
      <Grid container spacing={6}>

        <Grid item xs={12}>
          <UserListTable tableData={userData} />
        </Grid>
      </Grid>

    </>
  )
}
