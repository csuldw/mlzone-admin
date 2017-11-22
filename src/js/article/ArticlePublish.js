import ElCol from "element-ui/packages/col/src/col";

var mavonEditor = require('mavon-editor')
import 'mavon-editor/dist/css/index.css'
import ElRow from "element-ui/packages/row/src/row";
export default {
	name: 'editor',
	components: {
		ElRow,
		ElCol,
		'mavon-editor': mavonEditor.mavonEditor
	},
	data() {
		return {
			form: {
				name: '',
				region: '',
				date1: '',
				date2: '',
				delivery: false,
				type: [],
				resource: '',
				desc: ''
			}
		}
	},
	methods: {
		onSubmit() {
			console.log('submit!');
		}
	}
}
