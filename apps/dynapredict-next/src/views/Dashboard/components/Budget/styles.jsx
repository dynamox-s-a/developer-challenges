export default theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    display: 'flex',
    alignItems: 'center'
  },
  content: {
    flexGrow: 1
  },
  title: {
    fontWeight: 700,
    color: theme.palette.text.secondary
  },
  details: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center'
  },
  difference: {
    fontWeight: 700,
    marginLeft: theme.spacing.unit,
    backgroundColor: theme.palette.danger.light,
    color: theme.palette.danger.dark,
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing.unit * 0.5,
    paddingLeft: theme.spacing.unit * 0.5,
    paddingBottom: theme.spacing.unit * 0.5,
    paddingRight: theme.spacing.unit,
    borderRadius: '3px'
  },
  iconWrapper: {},
  icon: {
    color: theme.palette.text.secondary,
    opacity: 0.2,
    width: '4rem',
    height: '4rem',
    fontSize: '4rem'
  }
});
