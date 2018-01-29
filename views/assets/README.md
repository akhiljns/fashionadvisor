# Fashion Advisor

### sara mysql ka saman yaha dalna hai

```mysql
delimiter //

DROP IF PROCEDURE EXISTS applicableAge//
CREATE PROCEDURE applicableAge(IN age int)
BEGIN//
  IF (age < 18 OR age > 35) THEN signal sqlstate '45000' set_message_text = 'entered participant should be in age limit (18-35)';
  END IF;
END//

delimiter ;
```
delimiter //

CREATE TRIGGER applicableAge
AFTER INSERT ON participant
BEGIN//
  IF(NEW.age<18 OR NEW.age>35) THEN signal sqlstate '45000' set message_text =  'entered participant should be in age limit(18-35)';
  END IF;
END  

delimiter ;
