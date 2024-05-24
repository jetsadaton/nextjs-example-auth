import { Box } from '@mui/material'

import loadingStyle from '@/assets/styles/loading.module.css'

const Loading = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        zIndex: 9999,
        backgroundColor: '#45454515'
      }}
    >
      <Box sx={{ position: 'fixed', top: '50%', left: '50%' }}>
        <span className={loadingStyle.loader}></span>
      </Box>
    </Box>
  )
}

export default Loading

/**
 * Loading css more
 * https://css-loaders.com/arcade/
 * https://cssloaders.github.io/
 */
