declare module 'keystone' {
	declare module.exports: {
		list: (
			name: string
		) => {
			model: {
				findOne: (name: Object) => Object,
			},
		},
	};
}
