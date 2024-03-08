import _ from 'lodash';
import './list.view.css';
class ListViewTemplate {

    constructor(options) {
        this.options = options;
    };

    onShow(templateData){
        return templateData.map((options) => {
            return(
                <div className = 'brew-list-view-template-options' onClick = {() => options.onClick && options.onClick(options)}>
                    <div className = 'brew-list-view-template-options-value'>
                        {_.isFunction(options.data) ? options.data() : options.data}
                    </div>
                    <div className = 'brew-list-view-template-options-subdata'>
                        {this.options.allowSubData && (
                            _.isFunction(options.subData) ? options.subData() : options.subData
                        )}
                    </div>
                </div>
            )
        });
    };
}

export default ListViewTemplate;